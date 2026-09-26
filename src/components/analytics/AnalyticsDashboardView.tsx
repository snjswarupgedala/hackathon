import React from 'react';
import { BarChart3, TrendingUp, Sparkles, Award, BookOpen, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';

export const AnalyticsDashboardView: React.FC = () => {
  const { attendance, quizzes } = useData();

  const subjectPerformanceData = [
    { subject: 'DBMS', score: 86, attendance: 82.2 },
    { subject: 'OS', score: 74, attendance: 76.2 },
    { subject: 'CN', score: 89, attendance: 86.8 },
    { subject: 'Web Dev', score: 92, attendance: 91.4 },
    { subject: 'Maths', score: 78, attendance: 79.2 },
  ];

  const weeklyStudyHoursData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 4.0 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 4.5 },
    { day: 'Sun', hours: 3.0 },
  ];

  const quizTrendData = [
    { quiz: 'Quiz 1', score: 60 },
    { quiz: 'Quiz 2', score: 75 },
    { quiz: 'Quiz 3', score: 82 },
    { quiz: 'Quiz 4', score: 90 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Performance Analytics &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time charts tracking subject marks, weekly study hours, quiz scores, and AI diagnostic insights.
          </p>
        </div>
      </div>

      {/* AI Performance Insights Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-900/50 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-ai-purple/30 text-purple-300 border border-ai-purple/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Academic Insights Report
            </h3>
            <div className="space-y-1.5 mt-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                "Your performance in <strong className="text-white">DBMS</strong> improved by 12% this month after completing the 7-day study plan."
              </p>
              <p className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
                "Your weakest topic identified across quizzes is <strong className="text-white">Transactions &amp; ACID Isolation Levels</strong>."
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance & Attendance Bar Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Subject Marks &amp; Attendance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="subject" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#3b82f6" name="Subject Score %" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attendance" fill="#10b981" name="Attendance %" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Study Hours Area Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Weekly Study Hours (18.5 Total Hrs)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStudyHoursData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Study Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
