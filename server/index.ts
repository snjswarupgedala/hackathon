import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { usersDB, userStoresDB, getUserStore, seedDefaultUser, DBUser, createStarterUserData } from './db.js';
import { generateStudyPlanAI, summarizeNotesAI, solveDoubtAI, generateQuizAI } from './services/aiService.js';
import { initializeSupabasePersistence, persistUserState } from './supabase.js';

dotenv.config();

// Ensure seed user exists
seedDefaultUser();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'studymate_super_secret_jwt_key_2026';
const COOKIE_NAME = 'studymate_session';
let startupError: string | null = null;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/api', (req, res, next) => {
  if (startupError) {
    return res.status(503).json({ error: startupError });
  }
  next();
});

// Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 login attempts per IP
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Helper to return sanitized user object (NO passwordHash)
function sanitizeUser(user: DBUser) {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}

// Authentication Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies[COOKIE_NAME] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = usersDB.get(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User session invalid. Please log in again.' });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

// Persist authenticated writes before returning success to the client.
app.use('/api', (req: any, res, next) => {
  const sendJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    if (!req.userId || req.method === 'GET') return sendJson(body);

    void persistUserState(req.userId)
      .then(() => sendJson(body))
      .catch((error) => {
        console.error('Failed to persist user data to Supabase:', error);
        res.status(503);
        sendJson({ error: 'Your changes could not be saved. Please try again.' });
      });

    return res;
  }) as typeof res.json;
  next();
});

// ==================== AUTH ROUTES ====================

// 1. User Registration (Sign Up)
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, college, degree, branch, year, semester } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format. Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already registered
  const existingUser = Array.from(usersDB.values()).find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
  }

  // Hash password with bcrypt
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const newUser: DBUser = {
    id: userId,
    name: (name || '').trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    passwordHash,
    college: college || 'Engineering College',
    degree: degree || 'B.Tech',
    branch: branch || 'Computer Science',
    year: Number(year) || 1,
    semester: Number(semester) || 1,
    dailyStudyHours: 3,
    targetCGPA: 8.5,
    currentCGPA: 8.0,
    placementGoal: 'Software Engineer',
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  usersDB.set(userId, newUser);
  userStoresDB.set(userId, createStarterUserData());

  try {
    await persistUserState(userId);
  } catch (error) {
    usersDB.delete(userId);
    userStoresDB.delete(userId);
    console.error('Failed to persist new user to Supabase:', error);
    return res.status(503).json({ error: 'Your account could not be saved. Please try again.' });
  }

  // Issue JWT Cookie
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({ success: true, user: sanitizeUser(newUser) });
});

// 2. User Login
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = Array.from(usersDB.values()).find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Issue JWT Cookie
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ success: true, user: sanitizeUser(user) });
});

// 3. Current User Session Check
app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

// 4. Onboarding Complete
app.post('/api/auth/onboarding', authMiddleware, (req: any, res) => {
  const { dailyStudyHours, targetCGPA, placementGoal, college, degree, branch, year, semester } = req.body;
  const user = req.user as DBUser;

  user.dailyStudyHours = Number(dailyStudyHours) || user.dailyStudyHours || 3;
  user.targetCGPA = Number(targetCGPA) || user.targetCGPA || 8.5;
  if (placementGoal) user.placementGoal = placementGoal;
  if (college) user.college = college;
  if (degree) user.degree = degree;
  if (branch) user.branch = branch;
  if (year) user.year = Number(year);
  if (semester) user.semester = Number(semester);
  user.onboardingCompleted = true;
  user.updatedAt = new Date().toISOString();

  res.json({ success: true, user: sanitizeUser(user) });
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==================== PROTECTED DATA ROUTES ====================

// Full Per-User Data State API
app.get('/api/data', authMiddleware, (req: any, res) => {
  const store = getUserStore(req.userId);
  res.json({ user: sanitizeUser(req.user), ...store });
});

// Reset Per-User Data
app.post('/api/reset', authMiddleware, (req: any, res) => {
  userStoresDB.set(req.userId, createStarterUserData());
  res.json({ success: true, store: getUserStore(req.userId) });
});

// Attendance API
app.put('/api/attendance/:subjectId', authMiddleware, (req: any, res) => {
  const { subjectId } = req.params;
  const { attendedClasses, totalClasses } = req.body;
  const store = getUserStore(req.userId);

  const item = store.attendance.find(a => a.subjectId === subjectId);
  if (!item) return res.status(404).json({ error: 'Subject not found' });

  item.attendedClasses = Number(attendedClasses);
  item.totalClasses = Number(totalClasses);
  item.percentage = Number(((item.attendedClasses / item.totalClasses) * 100).toFixed(1));

  const target75 = Math.ceil(0.75 * item.totalClasses);
  if (item.attendedClasses < target75) {
    item.classesToAttend75 = target75 - item.attendedClasses;
    item.maxClassesCanSkip = 0;
    item.status = 'warning';
  } else {
    item.classesToAttend75 = 0;
    item.maxClassesCanSkip = Math.floor((item.attendedClasses - 0.75 * item.totalClasses) / 0.75);
    item.status = item.percentage < 78 ? 'warning' : 'safe';
  }

  const sub = store.subjects.find(s => s.id === subjectId);
  if (sub) {
    sub.attendedClasses = item.attendedClasses;
    sub.totalClasses = item.totalClasses;
  }

  res.json({ success: true, attendance: store.attendance });
});

// Exams API & Connected Study Planner Trigger
app.post('/api/exams', authMiddleware, async (req: any, res) => {
  const { subjectName, examType, date, totalMarks, syllabus } = req.body;
  const store = getUserStore(req.userId);
  const daysRemaining = Math.max(1, Math.ceil((new Date(date).getTime() - new Date().getTime()) / 86400000));

  const newExam = {
    id: `exam_${Date.now()}`,
    subjectId: `sub_${Date.now()}`,
    subjectName,
    examType: examType || 'Endterm',
    date,
    totalMarks: Number(totalMarks) || 100,
    syllabus: Array.isArray(syllabus) ? syllabus : [syllabus || 'Full Course Syllabus'],
    daysRemaining,
    planGenerated: false
  };

  store.exams.unshift(newExam);

  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: `New Exam Added: ${subjectName}`,
    message: `${examType} exam scheduled for ${date} (${daysRemaining} days remaining). Click to generate an AI study plan.`,
    type: 'info',
    timestamp: 'Just now',
    read: false,
    actionSection: 'planner'
  });

  res.json({ success: true, exam: newExam, exams: store.exams });
});

// AI Study Planner API
app.post('/api/study-planner/generate', authMiddleware, async (req: any, res) => {
  const { examId, subjectName, examDate, availableHoursPerDay, knowledgeLevel } = req.body;
  const store = getUserStore(req.userId);
  const daysRemaining = Math.max(1, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / 86400000));

  const aiResult = await generateStudyPlanAI({
    subject: subjectName,
    examDate,
    daysRemaining,
    availableHoursPerDay: Number(availableHoursPerDay) || 3,
    knowledgeLevel: knowledgeLevel || 'Intermediate'
  });

  const formattedTasks = aiResult.tasks.map((t: any, idx: number) => ({
    id: `task_${Date.now()}_${idx}`,
    dayNumber: t.dayNumber || idx + 1,
    dateStr: t.dateStr,
    subjectName,
    topic: t.topic,
    priority: t.priority || 'medium',
    durationMinutes: t.durationMinutes || 180,
    type: t.type || 'concept',
    completed: false
  }));

  const newPlan = {
    id: `plan_${Date.now()}`,
    examId,
    subjectName,
    examDate,
    availableHoursPerDay: Number(availableHoursPerDay) || 3,
    createdAt: new Date().toISOString(),
    tasks: formattedTasks
  };

  if (examId) {
    const exam = store.exams.find(e => e.id === examId);
    if (exam) exam.planGenerated = true;
  }

  store.studyPlans.unshift(newPlan);

  res.json({ success: true, plan: newPlan, studyPlans: store.studyPlans });
});

// Study Task Completion & XP Gamification Engine
app.post('/api/study-planner/task/toggle', authMiddleware, (req: any, res) => {
  const { taskId } = req.body;
  const store = getUserStore(req.userId);
  let taskFound: any = null;

  for (const plan of store.studyPlans) {
    const t = plan.tasks.find((task: any) => task.id === taskId);
    if (t) {
      t.completed = !t.completed;
      taskFound = t;
      break;
    }
  }

  if (taskFound && taskFound.completed) {
    store.gamification.totalXP += 50;
    if (store.gamification.totalXP >= store.gamification.level * 400) {
      store.gamification.level += 1;
      store.gamification.levelTitle = 'Academic Mastermind Level ' + store.gamification.level;
    }
  }

  res.json({ success: true, task: taskFound, gamification: store.gamification, studyPlans: store.studyPlans });
});

// Notes Assistant API
app.post('/api/notes/upload', authMiddleware, async (req: any, res) => {
  const { title, subjectName, content, fileType } = req.body;
  const store = getUserStore(req.userId);

  const aiResult = await summarizeNotesAI(title, subjectName, content);

  const newNote = {
    id: `note_${Date.now()}`,
    title,
    subjectName,
    fileType: fileType || 'text',
    content,
    uploadDate: new Date().toISOString().split('T')[0],
    ...aiResult
  };

  store.notes.unshift(newNote);

  res.json({ success: true, note: newNote, notes: store.notes });
});

// AI Doubt Solver API
app.post('/api/doubt/ask', authMiddleware, async (req, res) => {
  const { question, mode } = req.body;

  const answer = await solveDoubtAI(question, mode || 'simple');

  res.json({
    success: true,
    message: {
      id: `msg_${Date.now()}`,
      sender: 'ai',
      text: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: mode || 'simple'
    }
  });
});

// AI Quiz Generator & Weak Topic Engine
app.post('/api/quiz/generate', authMiddleware, async (req, res) => {
  const { educationLevel, subjectName, topic, difficulty, numberOfQuestions } = req.body;

  const quiz = await generateQuizAI({
    educationLevel: educationLevel || 'Undergraduate / Degree',
    subjectName: subjectName || 'General Studies',
    topic: topic || 'General Revision',
    difficulty: difficulty || 'medium',
    numberOfQuestions: Number(numberOfQuestions) || 5
  });

  res.json({ success: true, quiz });
});

app.post('/api/quiz/submit', authMiddleware, (req: any, res) => {
  const { quizId, score, totalQuestions, subjectName, topic } = req.body;
  const store = getUserStore(req.userId);

  const numTotal = Number(totalQuestions) || 5;
  const numScore = Number(score) || 0;

  const quiz = store.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    const newCompletedQuiz = {
      id: quizId || `quiz_${Date.now()}`,
      title: req.body.title || `${subjectName || 'DBMS'}: ${topic || 'Topic'} Quiz`,
      subjectName: subjectName || 'DBMS',
      topic: topic || 'General Revision',
      difficulty: req.body.difficulty || 'medium',
      questions: req.body.questions || [],
      score: numScore,
      totalQuestions: numTotal,
      completedAt: new Date().toISOString(),
      weakTopicsIdentified: (numScore / numTotal) < 0.7 ? [topic || 'Advanced Concepts'] : []
    };
    store.quizzes.unshift(newCompletedQuiz);
  } else {
    quiz.score = numScore;
    quiz.totalQuestions = numTotal;
    quiz.completedAt = new Date().toISOString();
  }

  const scorePct = Math.round((numScore / numTotal) * 100);
  if (scorePct < 70) {
    const existing = store.weakTopics.find(wt => wt.topicName.toLowerCase().includes((topic || '').toLowerCase()));
    if (!existing) {
      store.weakTopics.unshift({
        id: `wt_${Date.now()}`,
        subjectName: subjectName || 'DBMS',
        topicName: topic || 'Quiz Weak Topic',
        level: scorePct < 50 ? 'weak' : 'average',
        scorePercentage: scorePct,
        lastTestedDate: new Date().toISOString().split('T')[0],
        recommendedAction: `Read summary notes and practice questions on ${topic || 'this topic'}.`
      });
    }
  }

  store.gamification.totalXP += 100;

  res.json({
    success: true,
    score: numScore,
    total: numTotal,
    weakTopics: store.weakTopics,
    gamification: store.gamification
  });
});

// Assignments API
app.post('/api/assignments', authMiddleware, (req: any, res) => {
  const { title, subjectName, description, dueDate, priority } = req.body;
  const store = getUserStore(req.userId);

  const newAssign = {
    id: `assign_${Date.now()}`,
    title,
    subjectId: `sub_${Date.now()}`,
    subjectName,
    description,
    dueDate,
    priority: priority || 'medium',
    status: 'pending'
  };

  store.assignments.unshift(newAssign);

  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: `New Assignment: ${title}`,
    message: `Due on ${dueDate} for ${subjectName}. Set your priority and track your progress.`,
    type: 'info',
    timestamp: 'Just now',
    read: false,
    actionSection: 'assignments'
  });

  res.json({ success: true, assignment: newAssign, assignments: store.assignments });
});

app.put('/api/assignments/:id/status', authMiddleware, (req: any, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const store = getUserStore(req.userId);

  const assign = store.assignments.find(a => a.id === id);
  if (assign) {
    assign.status = status;
    if (status === 'completed') {
      store.gamification.totalXP += 30;
    }
  }

  res.json({ success: true, assignments: store.assignments, gamification: store.gamification });
});

// Goals API
app.post('/api/goals', authMiddleware, (req: any, res) => {
  const { title, category, targetValue, deadline } = req.body;
  const store = getUserStore(req.userId);

  const newGoal = {
    id: `goal_${Date.now()}`,
    title,
    category: category || 'cgpa',
    targetValue,
    currentProgress: 10,
    deadline,
    status: 'active',
    tasks: [
      { id: `gt_${Date.now()}_1`, title: 'Define study milestones & action plan', completed: true },
      { id: `gt_${Date.now()}_2`, title: 'Review progress weekly', completed: false }
    ]
  };

  store.goals.unshift(newGoal);

  res.json({ success: true, goal: newGoal, goals: store.goals });
});

// Resume AI Optimizer
app.post('/api/placement/resume', authMiddleware, (req: any, res) => {
  const { resumeData } = req.body;
  const store = getUserStore(req.userId);

  store.placement.resume = {
    ...store.placement.resume,
    ...resumeData,
    overallScore: 92,
    aiFeedback: [
      'Great inclusion of technical stack and projects!',
      'Quantified outcomes added: "Built study planner used by 100+ students".',
      'Formatting and layout look crisp for tech recruiter screening.'
    ]
  };

  res.json({ success: true, resume: store.placement.resume });
});

initializeSupabasePersistence()
  .then((supabaseEnabled) => {
    console.log(supabaseEnabled ? 'Supabase persistence enabled.' : 'Supabase not configured; using in-memory data.');
    app.listen(PORT, () => {
      console.log(`StudyMate AI Server running securely on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize Supabase persistence:', error);
    startupError = 'Supabase setup is incomplete. Run supabase/schema.sql and configure a server-side Secret or service_role key.';
    app.listen(PORT, () => {
      console.error(`StudyMate AI API is unavailable on port ${PORT} until Supabase setup is fixed.`);
    });
  });
