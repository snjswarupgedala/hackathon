import React from 'react';
import { Flame, Trophy, Target, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';

export const GamificationWidget: React.FC = () => {
  const { gamification } = useData();

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Target': return <Target className="w-5 h-5 text-emerald-500" />;
      default: return <Trophy className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Academic Achievements & Badges</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Level {gamification.level} • {gamification.levelTitle}</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          🔥 {gamification.streakDays} Day Active Streak
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gamification.badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3.5 rounded-xl border transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-800/60 dark:to-amber-950/20 border-amber-200 dark:border-amber-800/60'
                : 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                {getBadgeIcon(badge.icon)}
              </div>
              {badge.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{badge.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{badge.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
