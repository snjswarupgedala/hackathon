import React, { useState } from 'react';
import { CalendarCheck, Sparkles, Plus, Clock, CheckCircle2, Circle, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export const StudyPlannerView: React.FC = () => {
  const { studyPlans, exams, generateStudyPlan, toggleStudyTask, isLoading } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [subjectName, setSubjectName] = useState('DBMS');
  const [examDate, setExamDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [knowledgeLevel, setKnowledgeLevel] = useState('Intermediate');

  const activePlan = studyPlans.length > 0 ? studyPlans[0] : null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateStudyPlan(selectedExamId, subjectName, examDate, hoursPerDay, knowledgeLevel);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            AI Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automated multi-day study schedule based on exam deadlines and available study hours.
          </p>
        </div>

        <Button variant="ai" size="md" onClick={() => setIsModalOpen(true)}>
          <Sparkles className="w-4 h-4" />
          <span>Generate New Study Plan</span>
        </Button>
      </div>

      {/* Current Active Plan Overview */}
      {activePlan ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-brand-600 via-indigo-600 to-ai-purple text-white shadow-glow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  Active Exam Sprint Plan
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activePlan.subjectName} Exam Prep
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Exam Date: {activePlan.examDate} • Dedicated Study: {activePlan.availableHoursPerDay} hrs / day
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Plan</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* 7-Day Timeline Tasks Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
              Daily Timeline & Topic Priority
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePlan.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleStudyTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    task.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                          Day {task.dayNumber} ({task.dateStr})
                        </span>
                        <Badge variant={task.priority === 'high' ? 'danger' : 'info'}>{task.priority}</Badge>
                      </div>

                      <h4 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        {task.topic}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.durationMinutes} mins
                        </span>
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {task.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {task.completed ? '+50 XP' : '50 XP'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="w-10 h-10 text-brand-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold">No active study plan generated</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Input your upcoming exam date and available hours per day. AI will generate a day-by-day revision schedule!
          </p>
          <Button variant="ai" size="md" onClick={() => setIsModalOpen(true)}>
            <Sparkles className="w-4 h-4" /> Create Study Plan
          </Button>
        </Card>
      )}

      {/* Plan Generator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate AI Study Plan" maxWidth="lg">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Exam</label>
            <select
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                const ex = exams.find((ex) => ex.id === e.target.value);
                if (ex) {
                  setSubjectName(ex.subjectName);
                  setExamDate(ex.date);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
            >
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.subjectName} ({e.examType}) - {e.date} ({e.daysRemaining} days left)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Available Hours / Day</label>
              <input
                type="number"
                min={1}
                max={10}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Knowledge Level</label>
              <select
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              >
                <option value="Beginner">Beginner (Need deep topic coverage)</option>
                <option value="Intermediate">Intermediate (Balanced practice)</option>
                <option value="Advanced">Advanced (Speed revision & Mock tests)</option>
              </select>
            </div>
          </div>

          <Button variant="ai" size="lg" className="w-full mt-4" disabled={isLoading}>
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'AI Generating Plan...' : 'Generate 7-Day Plan'}</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};
