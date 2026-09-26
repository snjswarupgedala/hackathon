import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  AttendanceSummary,
  Exam,
  Assignment,
  StudyPlan,
  StudyTask,
  Note,
  Quiz,
  QuizQuestion,
  WeakTopic,
  AcademicGoal,
  GamificationState,
  PlacementPreparation,
  NotificationItem,
  NavSection,
  ExplanationMode
} from '../types';
import { initialData } from '../../server/db';
import { shuffleOptions } from '../utils/quizUtils';
import { useAuth } from './AuthContext';

interface DataContextType {
  subjects: Subject[];
  attendance: AttendanceSummary[];
  exams: Exam[];
  assignments: Assignment[];
  studyPlans: StudyPlan[];
  notes: Note[];
  quizzes: Quiz[];
  weakTopics: WeakTopic[];
  goals: AcademicGoal[];
  gamification: GamificationState;
  placement: PlacementPreparation;
  notifications: NotificationItem[];
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  isLoading: boolean;

  // Actions
  addExam: (exam: Partial<Exam>) => Promise<void>;
  generateStudyPlan: (examId: string, subjectName: string, examDate: string, hours: number, level: string) => Promise<StudyPlan>;
  toggleStudyTask: (taskId: string) => Promise<void>;
  uploadNote: (title: string, subjectName: string, content: string, fileType?: 'pdf' | 'txt' | 'text') => Promise<Note>;
  submitQuizResult: (quizId: string, topic: string, subjectName: string, score: number, total: number) => Promise<void>;
  updateAttendance: (subjectId: string, attended: number, total: number) => Promise<void>;
  addAssignment: (assign: Partial<Assignment>) => Promise<void>;
  updateAssignmentStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => Promise<void>;
  addGoal: (goal: Partial<AcademicGoal>) => Promise<void>;
  solveDoubtAI: (question: string, mode?: ExplanationMode) => Promise<string>;
  generateQuizAI: (
    educationLevel: string,
    subjectName: string,
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'auto',
    numQuestions: number
  ) => Promise<Quiz>;
  markNotificationRead: (id: string) => void;
  triggerVoiceCommand: (transcript: string) => { actionTaken: string; navigateTo?: NavSection };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>(initialData.subjects);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>(initialData.attendance);
  const [exams, setExams] = useState<Exam[]>(initialData.exams);
  const [assignments, setAssignments] = useState<Assignment[]>(initialData.assignments);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(initialData.studyPlans);
  const [notes, setNotes] = useState<Note[]>(initialData.notes);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialData.quizzes);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(initialData.weakTopics);
  const [goals, setGoals] = useState<AcademicGoal[]>(initialData.goals);
  const [gamification, setGamification] = useState<GamificationState>(initialData.gamification);
  const [placement, setPlacement] = useState<PlacementPreparation>(initialData.placement);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialData.notifications);

  // Sync isolated per-user data state from backend when user logs in / changes
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/data', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.subjects) setSubjects(data.subjects);
          if (data.attendance) setAttendance(data.attendance);
          if (data.exams) setExams(data.exams);
          if (data.assignments) setAssignments(data.assignments);
          if (data.studyPlans) setStudyPlans(data.studyPlans);
          if (data.notes) setNotes(data.notes);
          if (data.quizzes) setQuizzes(data.quizzes);
          if (data.weakTopics) setWeakTopics(data.weakTopics);
          if (data.goals) setGoals(data.goals);
          if (data.gamification) setGamification(data.gamification);
          if (data.placement) setPlacement(data.placement);
          if (data.notifications) setNotifications(data.notifications);
        }
      } catch (e) {
        console.warn('Backend API offline or unreachable, using local fallback state');
      }
    };

    fetchData();
  }, [user]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Add Exam & Connect to Study Planner
  const addExam = async (exam: Partial<Exam>) => {
    setIsLoading(true);
    const dateStr = exam.date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...exam, date: dateStr }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exams) setExams(data.exams);
      }
    } catch (e) {
      const daysRemaining = Math.max(1, Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / 86400000));
      const newExam: Exam = {
        id: `exam_${Date.now()}`,
        subjectId: `sub_${Date.now()}`,
        subjectName: exam.subjectName || 'DBMS',
        examType: exam.examType || 'Endterm',
        date: dateStr,
        totalMarks: exam.totalMarks || 100,
        syllabus: exam.syllabus || ['Module 1', 'Module 2', 'Module 3'],
        daysRemaining,
        planGenerated: false
      };
      setExams(prev => [newExam, ...prev]);
    }

    setIsLoading(false);
  };

  // Generate AI Study Plan
  const generateStudyPlan = async (
    examId: string,
    subjectName: string,
    examDate: string,
    hours: number,
    level: string
  ): Promise<StudyPlan> => {
    setIsLoading(true);
    let planResult: StudyPlan;

    try {
      const res = await fetch('/api/study-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, subjectName, examDate, availableHoursPerDay: hours, knowledgeLevel: level }),
        credentials: 'include'
      });
      const data = await res.json();
      planResult = data.plan;
      if (data.studyPlans) setStudyPlans(data.studyPlans);
    } catch (e) {
      const daysRemaining = Math.max(1, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / 86400000));
      const topics = [
        'Fundamental Concepts & Architecture',
        'Theoretical Frameworks & Theorems',
        'Advanced Algorithms & Implementation',
        'Problem Solving & Past Exam Questions',
        'Comprehensive Review & Speed Mock Test'
      ];

      const tasks: StudyTask[] = Array.from({ length: Math.min(daysRemaining, 7) }).map((_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() + idx);
        return {
          id: `task_${Date.now()}_${idx}`,
          dayNumber: idx + 1,
          dateStr: d.toISOString().split('T')[0],
          subjectName,
          topic: topics[idx % topics.length],
          priority: idx === 0 || idx === daysRemaining - 1 ? 'high' : 'medium',
          durationMinutes: hours * 60,
          type: idx === daysRemaining - 1 ? 'mock_test' : idx % 2 === 0 ? 'concept' : 'practice',
          completed: false
        };
      });

      planResult = {
        id: `plan_${Date.now()}`,
        examId,
        subjectName,
        examDate,
        availableHoursPerDay: hours,
        createdAt: new Date().toISOString(),
        tasks
      };
      setStudyPlans(prev => [planResult, ...prev]);
    }

    setExams(prev => prev.map(e => e.id === examId ? { ...e, planGenerated: true } : e));
    setIsLoading(false);
    triggerConfetti();

    return planResult;
  };

  // Toggle Study Task
  const toggleStudyTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/study-planner/task/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.studyPlans) setStudyPlans(data.studyPlans);
        if (data.gamification) setGamification(data.gamification);
        if (data.task?.completed) triggerConfetti();
        return;
      }
    } catch (e) {}

    // Fallback toggle
    setStudyPlans(prev =>
      prev.map(plan => ({
        ...plan,
        tasks: plan.tasks.map(t => {
          if (t.id === taskId) {
            const nextState = !t.completed;
            if (nextState) {
              triggerConfetti();
              setGamification(g => ({
                ...g,
                totalXP: g.totalXP + 50,
                level: Math.floor((g.totalXP + 50) / 400) + 1
              }));
            }
            return { ...t, completed: nextState };
          }
          return t;
        })
      }))
    );
  };

  // Upload Note
  const uploadNote = async (
    title: string,
    subjectName: string,
    content: string,
    fileType: 'pdf' | 'txt' | 'text' = 'pdf'
  ): Promise<Note> => {
    setIsLoading(true);

    let newNote: Note;
    try {
      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subjectName, content, fileType }),
        credentials: 'include'
      });
      const data = await res.json();
      newNote = data.note;
      if (data.notes) setNotes(data.notes);
    } catch (e) {
      newNote = {
        id: `note_${Date.now()}`,
        title,
        subjectName,
        fileType,
        content,
        uploadDate: new Date().toISOString().split('T')[0],
        summary: `Summary of ${title}: Key theoretical principles, step-by-step algorithms, and primary university exam questions for ${subjectName}.`,
        keyConcepts: [`Core ${subjectName} Architecture`, 'Mathematical Models', 'System Trade-offs'],
        definitions: ['Primary Definition: Fundamental construct in the study domain.'],
        questions2m: ['Define key terminology in short format.'],
        questions5m: ['Explain architecture with labeled block diagrams.'],
        questions10m: ['Derive step-by-step proofs and performance trade-offs.'],
        flashcards: [
          { id: 'fc1', question: 'What is the main objective of this module?', answer: 'To optimize efficiency and ensure correct data integrity.' }
        ]
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setIsLoading(false);
    triggerConfetti();
    return newNote;
  };

  // Submit Quiz Result & Detect Weak Topics
  const submitQuizResult = async (
    quizId: string,
    topic: string,
    subjectName: string,
    score: number,
    total: number
  ) => {
    const pct = Math.round((score / total) * 100);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, topic, subjectName, score, totalQuestions: total }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.weakTopics) setWeakTopics(data.weakTopics);
        if (data.gamification) setGamification(data.gamification);
        triggerConfetti();
        return;
      }
    } catch (e) {}

    // Fallback state update
    if (pct < 70) {
      setWeakTopics(prev => {
        const filtered = prev.filter(w => w.topicName !== topic);
        return [
          {
            id: `wt_${Date.now()}`,
            subjectName,
            topicName: topic,
            level: pct < 50 ? 'weak' : 'average',
            scorePercentage: pct,
            lastTestedDate: new Date().toISOString().split('T')[0],
            recommendedAction: `Read ${subjectName} notes and solve practice MCQs on ${topic}.`
          },
          ...filtered
        ];
      });
    }

    setGamification(g => ({
      ...g,
      totalXP: g.totalXP + 100,
      streakDays: g.streakDays
    }));

    triggerConfetti();
  };

  // Update Attendance
  const updateAttendance = async (subjectId: string, attended: number, total: number) => {
    try {
      const res = await fetch(`/api/attendance/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendedClasses: attended, totalClasses: total }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.attendance) setAttendance(data.attendance);
        return;
      }
    } catch (e) {}

    const percentage = Number(((attended / total) * 100).toFixed(1));
    const target75 = Math.ceil(0.75 * total);
    const classesToAttend75 = attended < target75 ? target75 - attended : 0;
    const maxClassesCanSkip = attended >= target75 ? Math.floor((attended - 0.75 * total) / 0.75) : 0;
    const status: 'safe' | 'warning' | 'critical' = percentage < 75 ? 'critical' : percentage < 78 ? 'warning' : 'safe';

    setAttendance(prev =>
      prev.map(a =>
        a.subjectId === subjectId
          ? { ...a, attendedClasses: attended, totalClasses: total, percentage, classesToAttend75, maxClassesCanSkip, status }
          : a
      )
    );

    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, attendedClasses: attended, totalClasses: total } : s))
    );
  };

  // Add Assignment
  const addAssignment = async (assign: Partial<Assignment>) => {
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assign),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.assignments) setAssignments(data.assignments);
        return;
      }
    } catch (e) {}

    const newAssign: Assignment = {
      id: `assign_${Date.now()}`,
      title: assign.title || 'Untitled Assignment',
      subjectId: assign.subjectId || 'sub_1',
      subjectName: assign.subjectName || 'DBMS',
      description: assign.description || '',
      dueDate: assign.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      priority: assign.priority || 'medium',
      status: 'pending'
    };

    setAssignments(prev => [newAssign, ...prev]);
  };

  const updateAssignmentStatus = async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const res = await fetch(`/api/assignments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.assignments) setAssignments(data.assignments);
        if (data.gamification) setGamification(data.gamification);
        if (status === 'completed') triggerConfetti();
        return;
      }
    } catch (e) {}

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (status === 'completed' && a.status !== 'completed') {
            triggerConfetti();
            setGamification(g => ({ ...g, totalXP: g.totalXP + 30 }));
          }
          return { ...a, status };
        }
        return a;
      })
    );
  };

  // Add Academic Goal
  const addGoal = async (goal: Partial<AcademicGoal>) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.goals) setGoals(data.goals);
        return;
      }
    } catch (e) {}

    const newGoal: AcademicGoal = {
      id: `goal_${Date.now()}`,
      title: goal.title || 'Academic Target',
      category: goal.category || 'cgpa',
      targetValue: goal.targetValue || '8.5 CGPA',
      currentProgress: 15,
      deadline: goal.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      tasks: [
        { id: `gt_${Date.now()}_1`, title: 'Break goal down into weekly targets', completed: true },
        { id: `gt_${Date.now()}_2`, title: 'Complete revision sessions', completed: false }
      ]
    };

    setGoals(prev => [newGoal, ...prev]);
  };

  // AI Doubt Solver
  const solveDoubtAI = async (question: string, mode: ExplanationMode = 'simple'): Promise<string> => {
    try {
      const res = await fetch('/api/doubt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mode }),
        credentials: 'include'
      });
      const data = await res.json();
      return data.message.text;
    } catch (e) {
      return `### 💡 StudyMate AI Explanation (${mode.toUpperCase()} MODE)

Here is a clear breakdown for **"${question}"**:

1. **Core Concept**: Essential principles formulated for college exams.
2. **Step-by-Step Logic**: Break down complex formulas into modular steps.
3. **Example**: Draw diagrams and write code snippets when applicable.

> **Tip:** You can ask for Telugu + English explanation or Step-by-Step mode anytime!`;
    }
  };

  // AI Quiz Generator
  const generateQuizAI = async (
    educationLevel: string,
    subjectName: string,
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'auto',
    numQuestions: number
  ): Promise<Quiz> => {
    setIsLoading(true);
    const count = [5, 10, 15, 20].includes(Number(numQuestions)) ? Number(numQuestions) : (Number(numQuestions) || 5);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ educationLevel, subjectName, topic, difficulty, numberOfQuestions: count }),
        credentials: 'include'
      });
      const data = await res.json();
      setIsLoading(false);
      return data.quiz;
    } catch (e) {
      setIsLoading(false);
      const fallbackQuestions: QuizQuestion[] = Array.from({ length: count }).map((_, idx) => {
        const rawOpts = [
          `Correct primary concept of ${topic} for ${educationLevel}`,
          `Alternative formulation of ${topic}`,
          `Secondary aspect of ${topic} in ${subjectName}`,
          `Irrelevant distractor statement`
        ];
        const { shuffledOptions, newCorrectIdx } = shuffleOptions(rawOpts, 0);

        return {
          id: `q_off_${Date.now()}_${idx}`,
          question: `${idx + 1}. In ${educationLevel} level ${subjectName} (${topic}), which statement is correct regarding concept #${idx + 1}?`,
          options: shuffledOptions,
          correctAnswerIndex: newCorrectIdx,
          explanation: `This is the fundamental principle of ${topic} in ${subjectName} for ${educationLevel} level.`
        };
      });

      return {
        id: `quiz_${Date.now()}`,
        title: `${subjectName}: ${topic} (${educationLevel})`,
        educationLevel,
        subjectName,
        topic,
        difficulty,
        totalQuestions: count,
        questions: fallbackQuestions
      };
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Smart Voice Assistant Parsing
  const triggerVoiceCommand = (transcript: string): { actionTaken: string; navigateTo?: NavSection } => {
    const t = transcript.toLowerCase();

    if (t.includes('study plan') || t.includes('schedule') || t.includes('planner')) {
      setActiveSection('planner');
      return { actionTaken: 'Opened AI Study Planner to generate your customized schedule.', navigateTo: 'planner' };
    }
    if (t.includes('assignment') || t.includes('homework') || t.includes('due')) {
      setActiveSection('assignments');
      return { actionTaken: 'Opened Assignment Manager showing your upcoming deadlines.', navigateTo: 'assignments' };
    }
    if (t.includes('attendance') || t.includes('bunk') || t.includes('classes')) {
      setActiveSection('attendance');
      return { actionTaken: 'Opened Attendance Tracker showing your 75% target status.', navigateTo: 'attendance' };
    }
    if (t.includes('quiz') || t.includes('test') || t.includes('mcq')) {
      setActiveSection('quiz');
      return { actionTaken: 'Opened AI Quiz Generator to start practice questions.', navigateTo: 'quiz' };
    }
    if (t.includes('notes') || t.includes('pdf') || t.includes('summary')) {
      setActiveSection('notes');
      return { actionTaken: 'Opened Notes Assistant for PDF upload & AI summary.', navigateTo: 'notes' };
    }
    if (t.includes('placement') || t.includes('resume') || t.includes('coding')) {
      setActiveSection('placements');
      return { actionTaken: 'Opened Placement Hub for aptitude & resume building.', navigateTo: 'placements' };
    }
    if (t.includes('doubt') || t.includes('ask') || t.includes('copilot') || t.includes('chat')) {
      setActiveSection('copilot');
      return { actionTaken: 'Opened AI Doubt Solver Copilot.', navigateTo: 'copilot' };
    }

    setActiveSection('dashboard');
    return { actionTaken: `Understood voice command: "${transcript}". Navigated to Dashboard.`, navigateTo: 'dashboard' };
  };

  return (
    <DataContext.Provider
      value={{
        subjects,
        attendance,
        exams,
        assignments,
        studyPlans,
        notes,
        quizzes,
        weakTopics,
        goals,
        gamification,
        placement,
        notifications,
        activeSection,
        setActiveSection,
        isLoading,
        addExam,
        generateStudyPlan,
        toggleStudyTask,
        uploadNote,
        submitQuizResult,
        updateAttendance,
        addAssignment,
        updateAssignmentStatus,
        addGoal,
        solveDoubtAI,
        generateQuizAI,
        markNotificationRead,
        triggerVoiceCommand
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
