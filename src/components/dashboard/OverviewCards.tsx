import React from 'react';
import { Clock, GraduationCap, CheckSquare, Flame, BookOpen, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';

export const OverviewCards: React.FC = () => {
  const { attendance, exams, assignments, gamification, setActiveSection } = useData();

  // Calculate overall attendance
  const totalAttended = attendance.reduce((sum, a) => sum + a.attendedClasses, 0);
  const totalClasses = attendance.reduce((sum, a) => sum + a.totalClasses, 0);
  const overallAttendance = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 80;

  const nextExam = exams.length > 0 ? exams[0] : null;
  const pendingAssignmentsCount = assignments.filter((a) => a.status !== 'completed').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Attendance % */}
      <Card hoverEffect onClick={() => setActiveSection('attendance')} className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance</span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-brand-600 dark:text-brand-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {overallAttendance}%
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" /> Safe (&gt;75%)
        </p>
      </Card>

      {/* Today's Classes */}
      <Card hoverEffect onClick={() => setActiveSection('attendance')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Classes</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          4 Classes
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">DBMS • OS • CN</p>
      </Card>

      {/* Upcoming Exam */}
      <Card hoverEffect onClick={() => setActiveSection('exams')} className="border-amber-200 dark:border-amber-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Exam</span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 truncate">
          {nextExam ? nextExam.subjectName : 'DBMS'}
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1">
          {nextExam ? `${nextExam.daysRemaining} Days Left` : '5 Days Left'}
        </p>
      </Card>

      {/* Pending Assignments */}
      <Card hoverEffect onClick={() => setActiveSection('assignments')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Tasks</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {pendingAssignmentsCount}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Assignments due</p>
      </Card>

      {/* Study Streak */}
      <Card hoverEffect onClick={() => setActiveSection('dashboard')} className="bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Study Streak</span>
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-500">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-amber-500">
          🔥 {gamification.streakDays} Days
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{gamification.totalXP} total XP</p>
      </Card>

      {/* Weekly Study Hours */}
      <Card hoverEffect onClick={() => setActiveSection('analytics')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Study Hours</span>
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          18.5 hrs
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">+2.4 hrs vs last week</p>
      </Card>
    </div>
  );
};
