import React from 'react';
import { Calendar, CheckCircle, Circle, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';

export const TodayPlanCard: React.FC = () => {
  const { studyPlans, toggleStudyTask, setActiveSection } = useData();

  const currentPlan = studyPlans.length > 0 ? studyPlans[0] : null;
  const todayTasks = currentPlan ? currentPlan.tasks.slice(0, 4) : [];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Today's Action Plan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">DBMS Endterm Revision &amp; Classes</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('planner')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Full Plan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {todayTasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No tasks scheduled for today. Generate an AI study plan!</p>
          ) : (
            todayTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleStudyTask(t.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  t.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 line-through opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button className="text-brand-600 dark:text-brand-400">
                    {t.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.topic}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{t.subjectName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {t.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    t.priority === 'high'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  }`}
                >
                  {t.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Completed: {todayTasks.filter((t) => t.completed).length} / {todayTasks.length}</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">+50 XP per task</span>
      </div>
    </Card>
  );
};
