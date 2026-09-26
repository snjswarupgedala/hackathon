import React from 'react';
import { Settings, Sun, Moon, Bell, RefreshCw, LogOut } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleResetData = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure StudyMate AI appearance, notifications, and reset demo data.
        </p>
      </div>

      <Card className="space-y-6 p-6">
        {/* Theme Settings */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance Mode</h3>
            <p className="text-xs text-slate-500">Switch between sleek dark mode and bright light mode.</p>
          </div>

          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>
        </div>

        {/* Reset Demo Data */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Reset Demo Data</h3>
            <p className="text-xs text-slate-500">Restore default demo student (Siva, DBMS, OS, CN) state.</p>
          </div>

          <Button variant="secondary" size="sm" onClick={handleResetData}>
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span>Reset Demo State</span>
          </Button>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Sign Out</h3>
            <p className="text-xs text-slate-500">Log out of your current student copilot session.</p>
          </div>

          <Button variant="danger" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
