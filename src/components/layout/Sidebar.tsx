import React from 'react';
import {
  LayoutDashboard,
  Bot,
  CalendarCheck,
  FileText,
  HelpCircle,
  Clock,
  CheckSquare,
  GraduationCap,
  BarChart3,
  Target,
  Briefcase,
  User,
  Settings,
  Sparkles,
  Flame,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { NavSection } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeSection, setActiveSection, gamification, notifications } = useData();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems: { id: NavSection; label: string; icon: any; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'AI' },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'notes', label: 'Notes Assistant', icon: FileText },
    { id: 'quiz', label: 'AI Quiz', icon: HelpCircle },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare },
    { id: 'exams', label: 'Exams', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'placements', label: 'Placements', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavSection) => {
    setActiveSection(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-brand-600 to-ai-purple bg-clip-text text-transparent">
                StudyMate AI
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">AI STUDENT COPILOT</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak & XP Widget */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-purple-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                {gamification.streakDays} Day Streak
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{gamification.totalXP} XP Solved</div>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            Lvl {gamification.level}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badge === 'AI'
                        ? 'bg-gradient-to-r from-ai-purple to-ai-pink text-white'
                        : 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Hackathon Demo Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hackathon Demo Mode</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">IIT Madras • CSE 3rd Year</p>
          </div>
        </div>
      </aside>
    </>
  );
};
