import React, { useState } from 'react';
import { Briefcase, Code, FileText, CheckCircle2, Sparkles, BookOpen, User } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';
import { InterviewQuestion } from '../../types';

export const PlacementHubView: React.FC = () => {
  const { placement } = useData();

  const [activeTab, setActiveTab] = useState<'aptitude' | 'coding' | 'interview' | 'resume'>('aptitude');
  const [resumeData, setResumeData] = useState(placement.resume);

  // Resume Review state
  const [isReviewing, setIsReviewing] = useState(false);

  const handleResumeReview = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch('/api/placement/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      });
      const data = await res.json();
      setResumeData(data.resume);
    } catch (e) {}
    setIsReviewing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Placement Preparation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Aptitude practice, DSA coding challenges, technical interview questions, and AI Resume Optimization.
          </p>
        </div>

        {/* Top Tab Bar */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {(['aptitude', 'coding', 'interview', 'resume'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Aptitude */}
      {activeTab === 'aptitude' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Quantitative Aptitude</span>
              <div className="text-2xl font-extrabold text-purple-600">{placement.aptitude.quantScore}% Score</div>
              <p className="text-xs text-slate-500">45 Problems Solved</p>
            </Card>

            <Card className="text-center p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Logical Reasoning</span>
              <div className="text-2xl font-extrabold text-indigo-600">{placement.aptitude.logicalScore}% Score</div>
              <p className="text-xs text-slate-500">55 Problems Solved</p>
            </Card>

            <Card className="text-center p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Verbal Ability</span>
              <div className="text-2xl font-extrabold text-brand-600">{placement.aptitude.verbalScore}% Score</div>
              <p className="text-xs text-slate-500">40 Problems Solved</p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Coding Problems */}
      {activeTab === 'coding' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-emerald-200 dark:border-emerald-900/60">
              <span className="text-xs font-bold text-emerald-600 uppercase">Easy Problems</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{placement.coding.easySolved} Solved</div>
              <p className="text-xs text-slate-500 mt-0.5">Arrays, Strings, HashMaps</p>
            </Card>

            <Card className="p-4 border-amber-200 dark:border-amber-900/60">
              <span className="text-xs font-bold text-amber-600 uppercase">Medium Problems</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{placement.coding.medSolved} Solved</div>
              <p className="text-xs text-slate-500 mt-0.5">Binary Trees, DP, Graphs</p>
            </Card>

            <Card className="p-4 border-rose-200 dark:border-rose-900/60">
              <span className="text-xs font-bold text-rose-600 uppercase">Hard Problems</span>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">{placement.coding.hardSolved} Solved</div>
              <p className="text-xs text-slate-500 mt-0.5">Tries, Segment Trees, Advanced DP</p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Interview Q&A */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placement.interviewQuestions.map((q: InterviewQuestion) => (
              <Card key={q.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={q.category === 'Technical' ? 'ai' : 'info'}>{q.category}</Badge>
                  {q.mastered && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Mastered</span>}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.question}</h3>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-purple-600 dark:text-purple-400 block mb-1">Sample Answer Outline:</strong>
                  {q.sampleAnswer}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Resume Optimizer */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-slate-900 to-purple-950 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">AI Resume Diagnostics</span>
                <h2 className="text-xl font-extrabold mt-1">Overall Resume Score: {resumeData.overallScore}/100</h2>
                <p className="text-xs text-slate-300 mt-1">Target Role: Software Development Engineer (SDE 1)</p>
              </div>

              <Button variant="ai" size="md" onClick={handleResumeReview} disabled={isReviewing}>
                <Sparkles className="w-4 h-4" />
                <span>{isReviewing ? 'Analyzing Resume...' : 'Re-Run AI Resume Audit'}</span>
              </Button>
            </div>
          </Card>

          {/* AI Suggestions List */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Recommendations to Boost Callback Rate</h3>
            <div className="space-y-2">
              {resumeData.aiFeedback.map((item: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
