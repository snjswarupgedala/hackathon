import React from 'react';
import { Sparkles, Bot, CalendarCheck, FileText, HelpCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';

export const AIRecommendationCard: React.FC = () => {
  const { setActiveSection } = useData();

  return (
    <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-900/50 relative overflow-hidden shadow-xl p-6">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-ai-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple flex items-center justify-center text-white shrink-0 shadow-glow-purple">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-ai-purple/30 text-purple-300 border border-ai-purple/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Smart Recommendation
              </span>
              <span className="text-xs text-slate-400">Personalized Copilot Insight</span>
            </div>

            <p className="text-sm md:text-base font-semibold text-slate-100 max-w-2xl leading-relaxed">
              "Your DBMS exam is approaching in 5 days. Based on your recent quiz performance, prioritize <span className="text-amber-400 underline font-bold">Normalization</span> and <span className="text-amber-400 underline font-bold">Transactions &amp; ACID Properties</span> today."
            </p>
          </div>
        </div>

        {/* 4 Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <Button variant="ai" size="sm" onClick={() => setActiveSection('copilot')}>
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setActiveSection('planner')} className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700">
            <CalendarCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Study Plan</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setActiveSection('notes')} className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Notes</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setActiveSection('quiz')} className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Take Quiz</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
