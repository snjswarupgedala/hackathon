import React from 'react';
import { Target, AlertTriangle, CheckCircle2, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';

export const WeakTopicDetectorView: React.FC = () => {
  const { weakTopics, setActiveSection } = useData();

  const strongTopics = weakTopics.filter((w) => w.level === 'strong');
  const averageTopics = weakTopics.filter((w) => w.level === 'average');
  const weakList = weakTopics.filter((w) => w.level === 'weak');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-rose-500" />
            AI Weak Topic Diagnostic Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automatically pinpoints your weak academic concepts from quiz results and prescribes targeted revision.
          </p>
        </div>
      </div>

      {/* 3 Categories Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Needs Improvement / Weak Topics */}
        <Card className="border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Weak Topics (&lt;60%)
            </h3>
            <Badge variant="danger">{weakList.length} Topics</Badge>
          </div>

          <div className="space-y-3">
            {weakList.map((wt) => (
              <div key={wt.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500">{wt.subjectName}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{wt.topicName}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-rose-600">{wt.scorePercentage}%</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">{wt.recommendedAction}</p>

                <Button variant="ai" size="sm" className="w-full text-xs" onClick={() => setActiveSection('notes')}>
                  <BookOpen className="w-3.5 h-3.5" /> Study Recommended Notes
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Average Topics */}
        <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Target className="w-4 h-4" /> Average Topics (60-75%)
            </h3>
            <Badge variant="warning">{averageTopics.length} Topics</Badge>
          </div>

          <div className="space-y-3">
            {averageTopics.map((wt) => (
              <div key={wt.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500">{wt.subjectName}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{wt.topicName}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600">{wt.scorePercentage}%</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">{wt.recommendedAction}</p>

                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setActiveSection('quiz')}>
                  <HelpCircle className="w-3.5 h-3.5" /> Practice 5 MCQs
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Strong Topics */}
        <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Strong Topics (&gt;75%)
            </h3>
            <Badge variant="success">Mastered</Badge>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">SQL Basics &amp; Relational Algebra</h4>
            <p className="text-slate-500">Mastered with 88% accuracy across 3 recent quiz sessions.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
