import React, { useState } from 'react';
import { Clock, Plus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export const AttendanceTrackerView: React.FC = () => {
  const { attendance, updateAttendance } = useData();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [attendedInput, setAttendedInput] = useState(37);
  const [totalInput, setTotalInput] = useState(45);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (item: any) => {
    setSelectedSubjectId(item.subjectId);
    setAttendedInput(item.attendedClasses);
    setTotalInput(item.totalClasses);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;
    await updateAttendance(selectedSubjectId, attendedInput, totalInput);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Smart Attendance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automatically calculates your percentage, safe bunk limit, and classes required for 75% cutoff.
          </p>
        </div>
      </div>

      {/* Attendance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendance.map((item) => {
          const isWarning = item.percentage < 78;
          const isCritical = item.percentage < 75;

          return (
            <Card
              key={item.subjectId}
              className={`space-y-4 border transition-all ${
                isCritical
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : isWarning
                  ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">{item.code}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.subjectName}</h3>
                </div>
                <Badge variant={isCritical ? 'danger' : isWarning ? 'warning' : 'success'}>
                  {item.percentage}%
                </Badge>
              </div>

              {/* Attendance Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Attended: {item.attendedClasses} / {item.totalClasses}</span>
                  <span>Target: 75%</span>
                </div>

                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Calculator Threshold Feedback */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                {item.classesToAttend75 > 0 ? (
                  <p className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Must attend {item.classesToAttend75} consecutive classes to reach 75%!
                  </p>
                ) : (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Safe! You can miss up to {item.maxClassesCanSkip} more classes staying above 75%.
                  </p>
                )}
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditClick(item)}>
                Update Attendance Log
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Subject Attendance" maxWidth="sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Attended Classes</label>
            <input
              type="number"
              min={0}
              max={totalInput}
              value={attendedInput}
              onChange={(e) => setAttendedInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Total Classes Held</label>
            <input
              type="number"
              min={1}
              value={totalInput}
              onChange={(e) => setTotalInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
            />
          </div>

          <Button variant="primary" size="md" className="w-full mt-2">
            Save &amp; Recalculate Thresholds
          </Button>
        </form>
      </Modal>
    </div>
  );
};
