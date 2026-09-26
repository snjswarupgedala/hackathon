import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sparkles } from 'lucide-react';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { OnboardingWizard } from './components/auth/OnboardingWizard';

import { MainDashboardView } from './components/dashboard/MainDashboardView';
import { DoubtSolverView } from './components/doubtSolver/DoubtSolverView';
import { StudyPlannerView } from './components/studyPlanner/StudyPlannerView';
import { NotesAssistantView } from './components/notes/NotesAssistantView';
import { QuizGeneratorView } from './components/quiz/QuizGeneratorView';
import { AttendanceTrackerView } from './components/attendance/AttendanceTrackerView';
import { AssignmentManagerView } from './components/assignments/AssignmentManagerView';
import { ExamManagerView } from './components/exams/ExamManagerView';
import { AnalyticsDashboardView } from './components/analytics/AnalyticsDashboardView';
import { AcademicGoalsView } from './components/goals/AcademicGoalsView';
import { PlacementHubView } from './components/placement/PlacementHubView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const { activeSection } = useData();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple flex items-center justify-center text-white mb-4 shadow-glow animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-400">Authenticating StudyMate AI Copilot...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  if (!user?.onboardingCompleted) {
    return <OnboardingWizard />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainDashboardView />;
      case 'copilot':
        return <DoubtSolverView />;
      case 'planner':
        return <StudyPlannerView />;
      case 'notes':
        return <NotesAssistantView />;
      case 'quiz':
        return <QuizGeneratorView />;
      case 'attendance':
        return <AttendanceTrackerView />;
      case 'assignments':
        return <AssignmentManagerView />;
      case 'exams':
        return <ExamManagerView />;
      case 'analytics':
        return <AnalyticsDashboardView />;
      case 'goals':
        return <AcademicGoalsView />;
      case 'placements':
        return <PlacementHubView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onOpenMobileNav={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
