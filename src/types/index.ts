export type NavSection =
  | 'dashboard'
  | 'copilot'
  | 'planner'
  | 'notes'
  | 'quiz'
  | 'attendance'
  | 'assignments'
  | 'exams'
  | 'analytics'
  | 'goals'
  | 'placements'
  | 'profile'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
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
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  totalClasses: number;
  attendedClasses: number;
  color?: string;
}

export interface AttendanceSummary {
  subjectId: string;
  subjectName: string;
  code: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  classesToAttend75: number;
  maxClassesCanSkip: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  examType: 'Midterm' | 'Endterm' | 'Quiz' | 'Unit Test';
  date: string;
  totalMarks: number;
  syllabus: string[];
  daysRemaining: number;
  planGenerated?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface StudyTask {
  id: string;
  dayNumber: number;
  dateStr: string;
  subjectName: string;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  durationMinutes: number;
  type: 'concept' | 'practice' | 'revision' | 'mock_test';
  completed: boolean;
  notesRef?: string;
}

export interface StudyPlan {
  id: string;
  examId?: string;
  subjectName: string;
  examDate: string;
  availableHoursPerDay: number;
  createdAt: string;
  tasks: StudyTask[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Note {
  id: string;
  title: string;
  subjectName: string;
  fileType: 'pdf' | 'txt' | 'text' | 'image';
  content: string;
  uploadDate: string;
  summary: string;
  keyConcepts: string[];
  definitions: string[];
  questions2m: string[];
  questions5m: string[];
  questions10m: string[];
  flashcards: Flashcard[];
}

export type ExplanationMode = 'simple' | 'detailed' | 'example' | 'step_by_step' | 'bilingual';

export interface DoubtMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  mode?: ExplanationMode;
  codeSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  educationLevel?: string;
  subjectName: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'auto';
  questions: QuizQuestion[];
  score?: number;
  totalQuestions: number;
  completedAt?: string;
  weakTopicsIdentified?: string[];
}

export interface WeakTopic {
  id: string;
  subjectName: string;
  topicName: string;
  level: 'strong' | 'average' | 'weak';
  scorePercentage: number;
  lastTestedDate: string;
  recommendedAction: string;
}

export interface GoalTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AcademicGoal {
  id: string;
  title: string;
  category: 'cgpa' | 'coding' | 'placement' | 'skill';
  targetValue: string;
  currentProgress: number;
  deadline: string;
  status: 'active' | 'achieved' | 'paused';
  tasks: GoalTask[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationState {
  streakDays: number;
  totalXP: number;
  level: number;
  levelTitle: string;
  badges: Badge[];
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  education: string;
  skills: string[];
  projects: { title: string; tech: string; description: string }[];
  experience: string;
  overallScore: number;
  aiFeedback: string[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solved: boolean;
  solutionSnippet?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'HR' | 'Technical';
  question: string;
  sampleAnswer: string;
  userNotes?: string;
  mastered: boolean;
}

export interface PlacementPreparation {
  aptitude: { quantScore: number; logicalScore: number; verbalScore: number; totalSolved: number };
  coding: { easySolved: number; medSolved: number; hardSolved: number; totalProblems: number };
  interviewQuestions: InterviewQuestion[];
  resume: ResumeData;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  timestamp: string;
  read: boolean;
  actionSection?: NavSection;
}
