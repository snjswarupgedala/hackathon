import React, { useState } from 'react';
import { CheckSquare, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export const AssignmentManagerView: React.FC = () => {
  const { assignments, addAssignment, updateAssignmentStatus } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('DBMS');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addAssignment({ title, subjectName, description, dueDate, priority });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-500" />
            Assignment Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track coursework deadlines, prioritize urgent tasks, and mark assignments complete.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add New Assignment</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.map((a) => (
          <Card key={a.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{a.subjectName}</span>
                <Badge variant={a.priority === 'high' ? 'danger' : 'info'}>{a.priority} priority</Badge>
              </div>

              <h3 className={`text-base font-bold ${a.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {a.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{a.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Due: {a.dueDate}
              </span>

              <select
                value={a.status}
                onChange={(e) => updateAssignmentStatus(a.id, e.target.value as any)}
                className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="DBMS Normalization Problem Set"
            />
          </div>

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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="Instructions or problem set requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full mt-4">
            Create Assignment
          </Button>
        </form>
      </Modal>
    </div>
  );
};
