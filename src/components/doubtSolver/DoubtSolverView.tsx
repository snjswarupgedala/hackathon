import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Languages, Code2, BookOpen } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { ExplanationMode, DoubtMessage } from '../../types';

export const DoubtSolverView: React.FC = () => {
  const { solveDoubtAI } = useData();

  const [messages, setMessages] = useState<DoubtMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `### 👋 Hi Siva! I'm your AI Academic Copilot.

I can help you clear doubts in:
- **DBMS & SQL** (Normalization, Joins, ACID, Transactions)
- **Operating Systems** (Process Scheduling, Deadlocks, Paging)
- **Computer Networks** (IP Subnetting, OSI Model, TCP/UDP)
- **Web Development & Mathematics**

*Select your preferred mode below or click "Explain like I'm a beginner"!*`,
      timestamp: '10:00 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExplanationMode>('simple');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || inputQuery;
    if (!q.trim()) return;

    const userMsg: DoubtMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputQuery('');
    setIsTyping(true);

    const aiAnswer = await solveDoubtAI(q, selectedMode);

    const aiMsg: DoubtMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: aiAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: selectedMode
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const modeChips: { id: ExplanationMode; label: string; icon: any }[] = [
    { id: 'simple', label: 'Simple', icon: BookOpen },
    { id: 'detailed', label: 'Detailed', icon: Sparkles },
    { id: 'example', label: 'Example', icon: Code2 },
    { id: 'step_by_step', label: 'Step-by-Step', icon: RefreshCw },
    { id: 'bilingual', label: 'Telugu + English', icon: Languages },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-ai-purple" />
            AI Academic Doubt Solver
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ask any programming, mathematics or university subject doubt in simple language.
          </p>
        </div>

        {/* Quick Shortcut Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSend("Explain 3NF Normalization like I'm a beginner with a simple real-life example.")}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Explain like I'm a beginner</span>
        </Button>
      </div>

      {/* Main Chat Box Container */}
      <Card className="flex-1 flex flex-col justify-between overflow-hidden p-0 border-slate-200 dark:border-slate-800">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white font-bold text-xs'
                    : 'bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple text-white'
                }`}
              >
                {m.sender === 'user' ? 'S' : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {m.mode && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-ai-purple/20 text-ai-purple uppercase mb-2">
                    {m.mode.replace('_', ' ')} mode
                  </span>
                )}
                <div className="whitespace-pre-line font-sans">{m.text}</div>
                <span className="text-[10px] opacity-60 block mt-2 text-right">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 text-ai-purple animate-spin" />
              <span>StudyMate AI is typing explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Mode Selector */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Mode Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Mode:</span>
            {modeChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedMode(chip.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
                    selectedMode === chip.id
                      ? 'bg-ai-purple text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask any academic doubt (e.g. Difference between 3NF and BCNF)..."
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ai-purple text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />

            <Button variant="ai" size="md" className="py-3">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
