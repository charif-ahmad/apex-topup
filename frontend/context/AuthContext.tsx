'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthContextValue } from '@/types/auth';
import type { User } from '@/types/models';
import { logoutAction } from '@/actions/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [prevInitialUser, setPrevInitialUser] = useState<User | null>(initialUser);
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setUser(initialUser);
  }

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
