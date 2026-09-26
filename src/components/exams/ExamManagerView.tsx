import React, { useState } from 'react';
import { GraduationCap, Plus, CalendarCheck, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export const ExamManagerView: React.FC = () => {
  const { exams, addExam, generateStudyPlan, setActiveSection } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('Operating Systems');
  const [examType, setExamType] = useState<'Midterm' | 'Endterm' | 'Quiz' | 'Unit Test'>('Midterm');
  const [date, setDate] = useState(new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [syllabusInput, setSyllabusInput] = useState('Process Management, Deadlocks, Paging');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName) return;
    const syllabus = syllabusInput.split(',').map((s) => s.trim());
    await addExam({ subjectName, examType, date, totalMarks, syllabus });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            Exam Timetable &amp; Countdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View upcoming midterm and semester exams. Click any exam to trigger automated AI Study Planning!
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Exam Date</span>
        </Button>
      </div>

      {/* Exam Timetable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col justify-between space-y-4 border-amber-200/60 dark:border-amber-900/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="warning">{exam.examType}</Badge>
                <span className="text-xs font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  ⏳ {exam.daysRemaining} Days Left
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{exam.subjectName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Exam Date: {exam.date} • Total Marks: {exam.totalMarks}</p>

              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Breakdown:</span>
                <div className="flex flex-wrap gap-1">
                  {exam.syllabus?.map((topic, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="ai"
              size="sm"
              className="w-full"
              onClick={async () => {
                await generateStudyPlan(exam.id, exam.subjectName, exam.date, 3, 'Intermediate');
                setActiveSection('planner');
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{exam.planGenerated ? 'View AI Study Plan' : 'Generate AI Study Plan'}</span>
            </Button>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Upcoming Exam" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              >
                <option value="Midterm">Midterm</option>
                <option value="Endterm">Endterm</option>
                <option value="Quiz">Quiz</option>
                <option value="Unit Test">Unit Test</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Syllabus Modules (Comma separated)</label>
            <input
              type="text"
              value={syllabusInput}
              onChange={(e) => setSyllabusInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="Unit 1, Unit 2, Unit 3"
            />
          </div>

          <Button variant="primary" size="lg" className="w-full mt-4">
            Save Exam Date
          </Button>
        </form>
      </Modal>
    </div>
  );
};
