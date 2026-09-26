import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  Mic,
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../common/Button';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';
import { NavSection } from '../../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { notifications, markNotificationRead, setActiveSection } = useData();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleNotifClick = (id: string, section?: NavSection) => {
    markNotificationRead(id);
    if (section) setActiveSection(section);
    setIsNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Left Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {getGreeting()}, {user?.name || 'Siva'} 👋
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            Here's your academic overview for today.
          </p>
        </div>
      </div>

      {/* Quick Actions & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Pill Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ai" size="sm" onClick={() => setActiveSection('copilot')}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setActiveSection('planner')}>
            <Plus className="w-3.5 h-3.5" />
            <span>Study Plan</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setActiveSection('notes')}>
            <span>Upload Notes</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setActiveSection('quiz')}>
            <span>Take Quiz</span>
          </Button>
        </div>

        {/* Voice Assistant Launcher */}
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-ai-purple border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all shadow-sm"
          title="Voice Assistant"
        >
          <Mic className="w-4 h-4 animate-pulse" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                <span className="text-xs text-slate-400">{unreadCount} new</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No notifications right now</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n.id, n.actionSection)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.read ? 'bg-brand-50/40 dark:bg-brand-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'warning' || n.type === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => setActiveSection('profile')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name?.[0] || 'S'}
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </header>
  );
};
