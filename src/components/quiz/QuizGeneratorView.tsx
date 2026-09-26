import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, XCircle, Clock, Trophy, AlertTriangle, ArrowRight, RotateCcw, BookOpen, GraduationCap } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { Quiz } from '../../types';

const EDUCATION_LEVELS = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Intermediate / 11th / 12th',
  'Diploma',
  'Undergraduate / Degree',
  'B.Tech / Engineering',
  'Postgraduate / PG',
  'Other'
];

const SUBJECT_SUGGESTIONS = [
  'Mathematics',
  'English',
  'Science',
  'EVS (Environmental Studies)',
  'Social Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'DBMS (Database Systems)',
  'Operating Systems',
  'Java',
  'Python',
  'Data Structures & Algorithms',
  'Artificial Intelligence',
  'Machine Learning',
  'MBA / Business Studies',
  'Economics',
  'History'
];

export const QuizGeneratorView: React.FC = () => {
  const { quizzes, generateQuizAI, submitQuizResult, setActiveSection, isLoading } = useData();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Generator Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [educationLevel, setEducationLevel] = useState('B.Tech / Engineering');
  const [subjectName, setSubjectName] = useState('DBMS');
  const [topic, setTopic] = useState('Normalization & Transactions');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'auto'>('auto');
  const [numQuestions, setNumQuestions] = useState<number>(10);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSeconds > 0 && !quizSubmitted) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeftSeconds, quizSubmitted]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = await generateQuizAI(educationLevel, subjectName, topic, difficulty, numQuestions);
    setActiveQuiz(quiz);
    setUserAnswers({});
    setQuizSubmitted(false);
    setCalculatedScore(0);
    setIsModalOpen(false);

    // Set timer based on question count: 1.5 minutes per question
    const totalSecs = Math.max(120, quiz.totalQuestions * 90);
    setTimeLeftSeconds(totalSecs);
    setIsTimerRunning(true);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || quizSubmitted) return;
    setIsTimerRunning(false);

    let score = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    setCalculatedScore(score);
    setQuizSubmitted(true);

    await submitQuizResult(activeQuiz.id, activeQuiz.topic, activeQuiz.subjectName, score, activeQuiz.totalQuestions);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = activeQuiz ? activeQuiz.totalQuestions : 0;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-500" />
            Universal AI Quiz Generator &amp; Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate customized MCQ quizzes from Class 1 to PG level for ANY subject and ANY topic.
          </p>
        </div>

        <Button variant="ai" size="md" onClick={() => setIsModalOpen(true)}>
          <Sparkles className="w-4 h-4" />
          <span>Generate New Quiz</span>
        </Button>
      </div>

      {/* Active Quiz Runner */}
      {activeQuiz ? (
        <Card className="space-y-6 border-slate-300 dark:border-slate-800">
          {/* Header Bar with Level, Title, Difficulty, Timer & Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="ai">{activeQuiz.educationLevel || 'Degree'}</Badge>
                <span className="text-xs font-bold text-slate-500">{activeQuiz.subjectName}</span>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  • {activeQuiz.totalQuestions} Questions
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 border border-purple-500/20 uppercase">
                  {activeQuiz.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeQuiz.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Active Countdown Timer */}
              {!quizSubmitted ? (
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  timeLeftSeconds < 60
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>Time Left: {formatTimer(timeLeftSeconds)}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
                  <span className="text-xs text-amber-500 font-bold block">Final Score</span>
                  <span className="text-xl font-extrabold text-amber-500">
                    {calculatedScore} / {activeQuiz.totalQuestions} ({Math.round((calculatedScore / activeQuiz.totalQuestions) * 100)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar & Answer Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Answered: {answeredCount} of {totalQuestions} questions</span>
              <span>{progressPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-ai-purple rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, qIdx) => {
              const selectedOpt = userAnswers[q.id];

              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {qIdx + 1}. {q.question}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                      Q{qIdx + 1}/{totalQuestions}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-400';
                      if (selectedOpt === oIdx) {
                        btnStyle = 'bg-brand-600 text-white font-bold border-brand-700 shadow-sm';
                      }

                      if (quizSubmitted) {
                        if (oIdx === q.correctAnswerIndex) {
                          btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-700';
                        } else if (selectedOpt === oIdx && oIdx !== q.correctAnswerIndex) {
                          btnStyle = 'bg-rose-600 text-white font-bold border-rose-700';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {quizSubmitted && oIdx === q.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
                          {quizSubmitted && selectedOpt === oIdx && oIdx !== q.correctAnswerIndex && <XCircle className="w-5 h-5 shrink-0 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box after submit */}
                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 space-y-1">
                      <p className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        💡 Explanation:
                      </p>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <Button
              variant="ai"
              size="lg"
              className="w-full"
              onClick={handleSubmitQuiz}
              disabled={answeredCount === 0}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit &amp; Evaluate {activeQuiz.totalQuestions} Questions</span>
            </Button>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Quiz Evaluation Complete (+100 XP Earned)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {calculatedScore / activeQuiz.totalQuestions >= 0.7
                    ? 'Outstanding performance for this topic and grade level!'
                    : 'Weak topic detected! Revision recommendation updated on your dashboard.'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
                  <RotateCcw className="w-3.5 h-3.5" /> Generate Another Quiz
                </Button>
                <Button variant="ai" size="sm" onClick={() => setActiveSection('analytics')}>
                  View Analytics Matrix
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* History & Recent Quizzes */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Saved Quiz Session History</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <Card key={q.id} hoverEffect onClick={() => setActiveQuiz(q)}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="ai">{q.educationLevel || 'Degree'}</Badge>
                  <span className="text-xs font-bold text-amber-500">
                    Score: {q.score !== undefined ? `${q.score}/${q.totalQuestions}` : 'Not attempted'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.title}</h3>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Subject: {q.subjectName} ({q.topic})</span>
                  <span className="font-semibold text-brand-600">{q.totalQuestions} Questions</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Universal Generator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Universal AI Quiz" maxWidth="lg">
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Education Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Education Level (Class 1 to PG)
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 text-slate-100 font-bold"
            >
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Input with Datalist Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-400" />
              Subject (Type ANY subject or select a suggestion)
            </label>
            <input
              type="text"
              required
              list="subject-suggestions"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100 placeholder-slate-500"
              placeholder="Mathematics, Science, English, Physics, Python, History..."
            />
            <datalist id="subject-suggestions">
              {SUBJECT_SUGGESTIONS.map((sub) => (
                <option key={sub} value={sub} />
              ))}
            </datalist>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100 placeholder-slate-500"
              placeholder="Addition, Force and Pressure, Human Reproduction, Normalization, Neural Networks..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100"
              >
                <option value="auto">Auto (Match Education Level)</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 text-slate-100 font-bold"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
          </div>

          {/* Quick Question Count Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Question Count Selector:</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setNumQuestions(count)}
                  className={`py-2 text-xs font-extrabold rounded-xl border transition-all ${
                    numQuestions === count
                      ? 'bg-ai-purple text-white border-purple-500 shadow-glow-purple'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

          <Button variant="ai" size="lg" className="w-full mt-4" disabled={isLoading}>
            <Sparkles className="w-4 h-4" />
            <span>
              {isLoading
                ? 'AI Generating Level-Appropriate Questions...'
                : `Generate ${numQuestions}-Question Quiz for ${educationLevel}`}
            </span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};
