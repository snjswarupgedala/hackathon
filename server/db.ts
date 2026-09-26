import bcrypt from 'bcryptjs';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  college: string;
  degree: string;
  branch: string;
  year: number;
  semester: number;
  dailyStudyHours: number;
  targetCGPA: number;
  currentCGPA: number;
  placementGoal: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStoreData {
  subjects: any[];
  attendance: any[];
  exams: any[];
  assignments: any[];
  studyPlans: any[];
  notes: any[];
  quizzes: any[];
  weakTopics: any[];
  goals: any[];
  gamification: any;
  placement: any;
  notifications: any[];
}

// In-Memory Database for Users and Per-User Isolated Stores
export const usersDB: Map<string, DBUser> = new Map();
export const userStoresDB: Map<string, UserStoreData> = new Map();

// Helper to create starter template data for a user
export const initialData = createStarterUserData();

export function createStarterUserData(subjectName = 'DBMS'): UserStoreData {
  return {
    subjects: [
      { id: `sub_${Date.now()}_1`, name: 'DBMS', code: 'CS301', instructor: 'Dr. Ramesh Kumar', credits: 4, totalClasses: 45, attendedClasses: 37, color: 'bg-blue-500' },
      { id: `sub_${Date.now()}_2`, name: 'Operating Systems', code: 'CS302', instructor: 'Prof. Ananya Roy', credits: 4, totalClasses: 42, attendedClasses: 32, color: 'bg-indigo-500' },
      { id: `sub_${Date.now()}_3`, name: 'Computer Networks', code: 'CS303', instructor: 'Dr. S. K. Gupta', credits: 3, totalClasses: 38, attendedClasses: 33, color: 'bg-purple-500' },
      { id: `sub_${Date.now()}_4`, name: 'Web Development', code: 'CS304', instructor: 'Prof. Vikramaditya', credits: 3, totalClasses: 35, attendedClasses: 32, color: 'bg-emerald-500' },
      { id: `sub_${Date.now()}_5`, name: 'Mathematics IV', code: 'MA301', instructor: 'Dr. Priya Sharma', credits: 4, totalClasses: 48, attendedClasses: 38, color: 'bg-amber-500' },
    ],

    attendance: [
      { subjectId: `sub_${Date.now()}_1`, subjectName: 'DBMS', code: 'CS301', totalClasses: 45, attendedClasses: 37, percentage: 82.2, classesToAttend75: 0, maxClassesCanSkip: 4, status: 'safe' },
      { subjectId: `sub_${Date.now()}_2`, subjectName: 'Operating Systems', code: 'CS302', totalClasses: 42, attendedClasses: 32, percentage: 76.2, classesToAttend75: 0, maxClassesCanSkip: 0, status: 'warning' },
      { subjectId: `sub_${Date.now()}_3`, subjectName: 'Computer Networks', code: 'CS303', totalClasses: 38, attendedClasses: 33, percentage: 86.8, classesToAttend75: 0, maxClassesCanSkip: 5, status: 'safe' },
      { subjectId: `sub_${Date.now()}_4`, subjectName: 'Web Development', code: 'CS304', totalClasses: 35, attendedClasses: 32, percentage: 91.4, classesToAttend75: 0, maxClassesCanSkip: 7, status: 'safe' },
      { subjectId: `sub_${Date.now()}_5`, subjectName: 'Mathematics IV', code: 'MA301', totalClasses: 48, attendedClasses: 38, percentage: 79.2, classesToAttend75: 0, maxClassesCanSkip: 2, status: 'safe' },
    ],

    exams: [
      {
        id: `exam_${Date.now()}_1`,
        subjectId: `sub_${Date.now()}_1`,
        subjectName: 'DBMS',
        examType: 'Endterm',
        date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        totalMarks: 100,
        syllabus: ['ER Diagrams', 'Relational Algebra', 'SQL & Joins', 'Normalization (1NF-BCNF)', 'Transactions & ACID', 'Concurrency & Deadlocks'],
        daysRemaining: 5,
        planGenerated: true
      },
      {
        id: `exam_${Date.now()}_2`,
        subjectId: `sub_${Date.now()}_2`,
        subjectName: 'Operating Systems',
        examType: 'Midterm',
        date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
        totalMarks: 50,
        syllabus: ['Process Scheduling', 'Semaphores', 'Bankers Algorithm', 'Paging & Segmentation'],
        daysRemaining: 12,
        planGenerated: false
      }
    ],

    assignments: [
      {
        id: `assign_${Date.now()}_1`,
        title: 'DBMS Normalization Problem Set & ER Schema',
        subjectId: `sub_${Date.now()}_1`,
        subjectName: 'DBMS',
        description: 'Decompose given 1NF relation into 3NF and BCNF with step-by-step candidate key proof.',
        dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
        priority: 'high',
        status: 'pending'
      }
    ],

    studyPlans: [
      {
        id: `plan_${Date.now()}_1`,
        examId: `exam_${Date.now()}_1`,
        subjectName: 'DBMS',
        examDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        availableHoursPerDay: 3,
        createdAt: new Date().toISOString(),
        tasks: [
          { id: `t_${Date.now()}_1`, dayNumber: 1, dateStr: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], subjectName: 'DBMS', topic: 'ER Model + Relational Model Basics', priority: 'high', durationMinutes: 180, type: 'concept', completed: true },
          { id: `t_${Date.now()}_2`, dayNumber: 2, dateStr: new Date().toISOString().split('T')[0], subjectName: 'DBMS', topic: 'Normalization (1NF, 2NF, 3NF, BCNF)', priority: 'high', durationMinutes: 180, type: 'concept', completed: false },
          { id: `t_${Date.now()}_3`, dayNumber: 3, dateStr: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], subjectName: 'DBMS', topic: 'Transactions + ACID Properties', priority: 'high', durationMinutes: 180, type: 'practice', completed: false }
        ]
      }
    ],

    notes: [
      {
        id: `note_${Date.now()}_1`,
        title: 'DBMS Unit 3: Normalization & Transaction Processing',
        subjectName: 'DBMS',
        fileType: 'pdf',
        content: `Functional Dependency X -> Y means X uniquely determines Y. 1NF requires atomic attributes. 2NF removes partial key dependencies. 3NF removes transitive dependencies. BCNF requires left side of dependency to be a super key. Transaction properties ACID: Atomicity, Consistency, Isolation, Durability.`,
        uploadDate: new Date().toISOString().split('T')[0],
        summary: 'Comprehensive notes covering 1NF, 2NF, 3NF, BCNF decomposition and transaction processing.',
        keyConcepts: ['Functional Dependency & Candidate Keys', 'ACID Properties'],
        definitions: ['ACID: Set of properties guaranteeing database transactions process reliably.'],
        questions2m: ['Define functional dependency.'],
        questions5m: ['Explain 3NF decomposition.'],
        questions10m: ['Explain Strict 2PL and prove why it avoids cascading rollbacks.'],
        flashcards: [{ id: 'fc1', question: 'What is BCNF condition?', answer: 'For X -> Y, X must be a super key.' }]
      }
    ],

    quizzes: [],

    weakTopics: [
      {
        id: `wt_${Date.now()}_1`,
        subjectName: 'DBMS',
        topicName: 'Transactions & ACID Isolation Levels',
        level: 'weak',
        scorePercentage: 45,
        lastTestedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        recommendedAction: 'Review Unit 3 Notes on Strict 2PL and take a focused quiz.'
      }
    ],

    goals: [
      {
        id: `goal_${Date.now()}_1`,
        title: 'Achieve 8.8+ CGPA in Semester 6',
        category: 'cgpa',
        targetValue: '8.8 CGPA',
        currentProgress: 75,
        deadline: '2026-11-30',
        status: 'active',
        tasks: [
          { id: `gt_${Date.now()}_1`, title: 'Maintain >80% attendance in all 5 subjects', completed: true },
          { id: `gt_${Date.now()}_2`, title: 'Score 85%+ in Endterm Exam', completed: false }
        ]
      }
    ],

    gamification: {
      streakDays: 7,
      totalXP: 1450,
      level: 4,
      levelTitle: 'Academic Mastermind',
      badges: [
        { id: 'b1', title: '🔥 7 Day Streak', icon: 'Flame', description: 'Studied consistently for 7 consecutive days', unlocked: true, unlockedAt: '2026-09-25' },
        { id: 'b2', title: '📚 50 Solved', icon: 'BookOpen', description: 'Answered over 50 academic practice questions', unlocked: true, unlockedAt: '2026-09-24' }
      ]
    },

    placement: {
      aptitude: { quantScore: 82, logicalScore: 88, verbalScore: 78, totalSolved: 140 },
      coding: { easySolved: 65, medSolved: 45, hardSolved: 12, totalProblems: 122 },
      interviewQuestions: [
        { id: 'iq1', category: 'Technical', question: 'Explain the difference between Process and Thread in detail.', sampleAnswer: 'A process is an independent execution unit with its own memory space; a thread is a lightweight execution path within a process.', mastered: true }
      ],
      resume: {
        fullName: 'Student Name',
        email: 'student@college.edu',
        phone: '+91 9876543210',
        github: 'github.com/student-dev',
        linkedin: 'linkedin.com/in/student',
        education: 'B.Tech CSE (CGPA: 8.42/10)',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'Python'],
        projects: [
          { title: 'StudyMate AI Student Copilot', tech: 'React, TS, Node, Gemini AI', description: 'Full-stack academic platform.' }
        ],
        experience: 'Software Engineering Intern',
        overallScore: 88,
        aiFeedback: ['Include quantitative impact metrics in project descriptions.']
      }
    },

    notifications: [
      {
        id: `notif_${Date.now()}_1`,
        title: 'Welcome to StudyMate AI!',
        message: 'Your personal AI Student Copilot is ready. Track attendance, plan study schedules, and generate quizzes.',
        type: 'info',
        timestamp: 'Just now',
        read: false,
        actionSection: 'dashboard'
      }
    ]
  };
}

// Pre-seed Demo Registered User: siva@college.edu / Password@123
export function seedDefaultUser() {
  const sivaId = 'user_siva_101';
  const sivaEmail = 'siva@college.edu';

  if (!usersDB.has(sivaId)) {
    // Hash password "Password@123" securely
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Password@123', salt);

    const sivaUser: DBUser = {
      id: sivaId,
      name: 'Siva',
      email: sivaEmail,
      passwordHash,
      college: 'IIT Madras',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      dailyStudyHours: 3,
      targetCGPA: 8.8,
      currentCGPA: 8.42,
      placementGoal: 'Software Development Engineer (SDE 1) at Top Product Company',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    usersDB.set(sivaId, sivaUser);
    userStoresDB.set(sivaId, createStarterUserData('DBMS'));
  }
}

// Initialize seed user
seedDefaultUser();

// Get user data store or create if missing
export function getUserStore(userId: string): UserStoreData {
  if (!userStoresDB.has(userId)) {
    userStoresDB.set(userId, createStarterUserData());
  }
  return userStoresDB.get(userId)!;
}

// Reset Database Store helper
export function resetDB() {
  usersDB.clear();
  userStoresDB.clear();
  seedDefaultUser();
}
