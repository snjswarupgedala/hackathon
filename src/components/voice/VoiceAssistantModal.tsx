import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { triggerVoiceCommand } = useData();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    setResponseMessage('');
    setTranscript('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleCommandSubmit = (textToSubmit?: string) => {
    const query = textToSubmit || transcript;
    if (!query.trim()) return;

    const res = triggerVoiceCommand(query);
    setResponseMessage(res.actionTaken);

    // Text to Speech output if supported
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(res.actionTaken);
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Voice Assistant" maxWidth="md">
      <div className="flex flex-col items-center justify-center py-4 text-center">
        {/* Animated Listening Mic visualizer */}
        <div className="relative mb-6">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-ai-purple/30 animate-ping" />
          )}
          <button
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-rose-600 scale-110 shadow-rose-500/50'
                : 'bg-gradient-to-tr from-brand-600 to-ai-purple hover:scale-105 shadow-glow-purple'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {isListening ? 'Listening to your request...' : 'Tap Mic & Say a Command'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Examples: "Create a study plan for DBMS", "What assignments are due?", "Take a quiz on OS"
        </p>

        {/* Live Transcript Display */}
        <div className="w-full mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-h-[70px] flex items-center justify-center text-sm font-medium text-slate-800 dark:text-slate-200 italic">
          {transcript || (isListening ? 'Speak now...' : 'Your spoken command will appear here...')}
        </div>

        {/* Text Input Fallback */}
        <div className="w-full mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Or type a command..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommandSubmit()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button variant="ai" size="md" onClick={() => handleCommandSubmit()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* AI Action Response */}
        {responseMessage && (
          <div className="w-full mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-left text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-ai-purple shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">AI Assistant Action:</p>
              <p className="mt-0.5">{responseMessage}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
