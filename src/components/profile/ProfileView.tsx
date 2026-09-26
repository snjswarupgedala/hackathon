import React, { useState } from 'react';
import { User as UserIcon, Mail, Building, GraduationCap, Target, Clock, Edit3, Save } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || 'Siva');
  const [college, setCollege] = useState(user?.college || 'IIT Madras');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science & Engineering');
  const [targetCGPA, setTargetCGPA] = useState(user?.targetCGPA || 8.8);
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyHours || 3);

  const handleSave = () => {
    updateProfile({
      name,
      college,
      degree,
      branch,
      targetCGPA,
      dailyStudyHours: dailyHours
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Student Academic Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal credentials, college degree info, and study preferences.
          </p>
        </div>

        <Button variant={isEditing ? 'ai' : 'outline'} size="sm" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </Button>
      </div>

      <Card className="space-y-6 p-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-purple text-white flex items-center justify-center font-extrabold text-2xl shadow-glow">
            {name[0] || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 mt-1">
              Semester {user?.semester} • Year {user?.year}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">College / University</label>
            <input
              type="text"
              disabled={!isEditing}
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Course &amp; Degree</label>
            <input
              type="text"
              disabled={!isEditing}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Branch</label>
            <input
              type="text"
              disabled={!isEditing}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target CGPA</label>
            <input
              type="number"
              step={0.1}
              disabled={!isEditing}
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Daily Study Hours</label>
            <input
              type="number"
              disabled={!isEditing}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-80 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
