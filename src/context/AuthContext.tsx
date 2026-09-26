import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (details: any) => Promise<void>;
  completeOnboarding: (details: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (details: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function readApiResponse(res: Response) {
  if (!res.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The API server returned an unexpected response. Check that the backend is running and Supabase is configured.');
  }

  try {
    return await res.json();
  } catch {
    throw new Error('The API server returned invalid JSON. Check the backend configuration and try again.');
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Check existing session token cookie on initial page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await readApiResponse(res);
          if (data.user) {
            setUser(data.user);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
      credentials: 'include'
    });

    const data = await readApiResponse(res);

    if (!res.ok) {
      throw new Error(data.error || 'Invalid email or password.');
    }

    if (data.user) {
      setUser(data.user);
    }
  };

  const signup = async (details: any) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
      credentials: 'include'
    });

    const data = await readApiResponse(res);

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account.');
    }

    if (data.user) {
      setUser(data.user);
    }
  };

  const completeOnboarding = async (details: Partial<User>) => {
    if (!user) return;

    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await readApiResponse(res);
        if (data.user) {
          setUser(data.user);
          return;
        }
      }
    } catch (e) {}

    // Fallback state update
    setUser({ ...user, ...details, onboardingCompleted: true });
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    setUser(null);
  };

  const updateProfile = (details: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...details });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        signup,
        completeOnboarding,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
