import React, { useState } from 'react';
import { Mail, Lock, Sparkles, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('siva@college.edu');
    setPassword('Password@123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] text-slate-100">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-purple flex items-center justify-center text-white mb-3 shadow-glow">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-ai-purple bg-clip-text text-transparent">
            StudyMate AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">Log in to your AI Student Copilot platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-100 placeholder-slate-500"
                placeholder="siva@college.edu"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <a href="#forgot" className="text-xs text-brand-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-100 placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button variant="ai" size="lg" className="w-full mt-2" disabled={loading}>
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-brand-400 font-bold hover:underline">
            Sign Up
          </button>
        </p>

        {/* Demo Registered Credentials Hint */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Hackathon Registered Account:</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-xs text-amber-400 font-semibold hover:underline bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
          >
            ⚡ Auto-Fill Credentials: siva@college.edu
          </button>
        </div>
      </div>
    </div>
  );
};
