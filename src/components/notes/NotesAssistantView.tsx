import React, { useState } from 'react';
import { FileText, Upload, Sparkles, BookOpen, HelpCircle, Layers, CheckCircle2, RotateCw } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { useData } from '../../context/DataContext';

export const NotesAssistantView: React.FC = () => {
  const { notes, uploadNote, setActiveSection, isLoading } = useData();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'summary' | 'questions' | 'flashcards' | 'quiz'>('summary');

  // Flashcard flip state
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // Upload Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('DBMS');
  const [content, setContent] = useState('');

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const created = await uploadNote(title, subjectName, content, 'pdf');
    setSelectedNoteId(created.id);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            AI Notes &amp; PDF Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload PDFs or notes to generate summaries, 2m/5m/10m questions, interactive flashcards &amp; quizzes.
          </p>
        </div>

        <Button variant="ai" size="md" onClick={() => setIsModalOpen(true)}>
          <Upload className="w-4 h-4" />
          <span>Upload PDF / Paste Notes</span>
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No notes uploaded yet"
          description="Upload your first PDF or paste lecture notes to let AI turn it into instant study material."
          actionText="Upload Notes"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notes Sidebar Selector */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Your Document Library
            </h3>
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedNoteId === note.id
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                  <h4 className="text-xs font-bold truncate">{note.title}</h4>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>{note.subjectName}</span>
                  <span>{note.uploadDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Note Viewer & 4 Tabs */}
          {activeNote && (
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{activeNote.subjectName}</span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeNote.title}</h2>
                  </div>

                  {/* 4 Tabs: Summary | Questions | Flashcards | Quiz */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'summary' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'questions' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Questions
                    </button>
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'flashcards' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Flashcards
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'quiz' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Quiz
                    </button>
                  </div>
                </div>

                {/* Tab 1: Summary */}
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-ai-purple" /> AI Executive Summary
                      </h4>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {activeNote.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Key Concepts Covered</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeNote.keyConcepts?.map((c, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/50 text-xs font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Important Definitions</h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {activeNote.definitions?.map((d, i) => (
                          <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 2: University Exam Questions */}
                {activeTab === 'questions' && (
                  <div className="space-y-4">
                    {/* 2-Mark */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">2-Mark Short Questions</h4>
                      <div className="space-y-1.5">
                        {activeNote.questions2m?.map((q, i) => (
                          <div key={i} className="p-3 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Q{i + 1}. {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5-Mark */}
                    <div>
                      <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">5-Mark Medium Questions</h4>
                      <div className="space-y-1.5">
                        {activeNote.questions5m?.map((q, i) => (
                          <div key={i} className="p-3 rounded-xl bg-brand-50/30 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Q{i + 1}. {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 10-Mark */}
                    <div>
                      <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">10-Mark Detailed Questions</h4>
                      <div className="space-y-1.5">
                        {activeNote.questions10m?.map((q, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-purple-50/30 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs font-bold text-slate-800 dark:text-slate-200">
                            Q{i + 1}. {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Interactive Flashcards */}
                {activeTab === 'flashcards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeNote.flashcards?.map((fc) => {
                      const isFlipped = flippedCardId === fc.id;
                      return (
                        <div
                          key={fc.id}
                          onClick={() => setFlippedCardId(isFlipped ? null : fc.id)}
                          className="min-h-[120px] p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/30 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative"
                        >
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-2">
                            <span>{isFlipped ? 'Answer' : 'Question (Click to flip)'}</span>
                            <RotateCw className="w-3.5 h-3.5" />
                          </div>
                          <p className={`text-sm font-bold ${isFlipped ? 'text-brand-600 dark:text-brand-400' : 'text-slate-900 dark:text-slate-100'}`}>
                            {isFlipped ? fc.answer : fc.question}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 4: Interactive Note Quiz */}
                {activeTab === 'quiz' && (
                  <div className="text-center py-6">
                    <HelpCircle className="w-10 h-10 text-ai-purple mx-auto mb-2" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ready to test your knowledge on {activeNote.title}?</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                      AI can auto-generate a 5-question MCQ quiz specifically from this document!
                    </p>
                    <Button variant="ai" size="md" onClick={() => setActiveSection('quiz')}>
                      <Sparkles className="w-4 h-4" /> Start AI Note Quiz
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload PDF or Paste Notes" maxWidth="lg">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="DBMS Unit 3: Normalization & Transactions"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Note Text or Summary</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 text-slate-100"
              placeholder="Paste lecture notes or text here..."
            />
          </div>

          <Button variant="ai" size="lg" className="w-full mt-4" disabled={isLoading}>
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'AI Analyzing Notes...' : 'Process Notes with AI'}</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};
