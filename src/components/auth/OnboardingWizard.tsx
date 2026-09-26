import React, { useState } from 'react';
import { Sparkles, Clock, Target, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const OnboardingWizard: React.FC = () => {
  const { user, completeOnboarding } = useAuth();
  const [dailyStudyHours, setDailyStudyHours] = useState(3);
  const [targetCGPA, setTargetCGPA] = useState(8.8);
  const [placementGoal, setPlacementGoal] = useState('Software Development Engineer (SDE 1)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await completeOnboarding({
      dailyStudyHours,
      targetCGPA,
      placementGoal
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] text-slate-100">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple flex items-center justify-center text-white mb-3 shadow-glow-purple">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-ai-purple bg-clip-text text-transparent">
            Welcome {user?.name || 'Siva'} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            "Let's build your personalized academic success plan."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Daily Study Hours Slider */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                Daily Available Study Hours
              </label>
              <span className="text-sm font-bold text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full">
                {dailyStudyHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hr (Light)</span>
              <span>3 hrs (Standard)</span>
              <span>8 hrs (Exam Sprint)</span>
            </div>
          </div>

          {/* Target CGPA */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                Target Academic CGPA
              </label>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {targetCGPA} / 10.0
              </span>
            </div>
            <input
              type="range"
              min={6.0}
              max={10.0}
              step={0.1}
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Placement & Career Goal */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Placement & Career Aspiration
            </label>
            <input
              type="text"
              required
              value={placementGoal}
              onChange={(e) => setPlacementGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-100"
              placeholder="e.g. SDE 1 at Tier 1 Product Company / Higher Studies"
            />
          </div>

          <Button variant="ai" size="lg" className="w-full">
            <span>Generate My Personalized Academic Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
