import React from 'react';
import { AlertCircle, GraduationCap, CheckSquare, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';

export const UpcomingDeadlinesCard: React.FC = () => {
  const { exams, assignments, setActiveSection } = useData();

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Deadlines</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Exams & Pending Submissions</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('assignments')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Upcoming Exams */}
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => setActiveSection('exams')}
              className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{exam.subjectName} ({exam.examType})</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Date: {exam.date}</p>
                </div>
              </div>
              <Badge variant="warning">{exam.daysRemaining} days left</Badge>
            </div>
          ))}

          {/* Pending Assignments */}
          {assignments.slice(0, 2).map((assign) => (
            <div
              key={assign.id}
              onClick={() => setActiveSection('assignments')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-brand-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{assign.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{assign.subjectName} • Due: {assign.dueDate}</p>
                </div>
              </div>
              <Badge variant={assign.priority === 'high' ? 'danger' : 'info'}>{assign.priority}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
