import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle, Calendar, Trophy } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export const AcademicGoalsView: React.FC = () => {
  const { goals, addGoal } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cgpa' | 'coding' | 'placement' | 'skill'>('cgpa');
  const [targetValue, setTargetValue] = useState('8.8 CGPA');
  const [deadline, setDeadline] = useState('2026-11-30');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addGoal({ title, category, targetValue, deadline });
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Academic &amp; Placement Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set target CGPA, DSA coding milestones, and placement preparation deadlines.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="ai">{goal.category.toUpperCase()}</Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Deadline: {goal.deadline}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{goal.title}</h3>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">Target: {goal.targetValue}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Overall Progress</span>
                <span>{goal.currentProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-ai-purple rounded-full transition-all duration-500"
                  style={{ width: `${goal.currentProgress}%` }}
                />
              </div>
            </div>

            {/* Sub-tasks */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Action Milestones:</span>
              {goal.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className={task.completed ? 'line-through text-slate-400' : ''}>{task.title}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Academic Goal" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="Achieve 8.8 CGPA in Semester 6"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              >
                <option value="cgpa">CGPA Target</option>
                <option value="coding">Coding / DSA</option>
                <option value="placement">Placement Prep</option>
                <option value="skill">Skill Mastery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Value</label>
              <input
                type="text"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deadline</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
            />
          </div>

          <Button variant="primary" size="lg" className="w-full mt-4">
            Save Goal
          </Button>
        </form>
      </Modal>
    </div>
  );
};
