'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthUser,
  changePassword,
  fetchMe,
  loginUser,
  registerUser,
  updateProfile
} from '@/lib/clientApi';

const STORAGE_KEY = 'novaro_auth_token';

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isCreator: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: { name: string; email: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  updateUserProfile: (payload: Record<string, unknown>) => Promise<AuthUser>;
  updateUserPassword: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const currentToken = window.localStorage.getItem(STORAGE_KEY) || '';
    if (!currentToken) {
      setToken('');
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe(currentToken);
      setToken(currentToken);
      setUser(me);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const data = await loginUser(payload);
    window.localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string }) => {
    const data = await registerUser(payload);
    window.localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setUser(null);
  }, []);

  const updateUserProfile = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!token) throw new Error('Unauthorized');
      const updated = await updateProfile(payload, token);
      setUser(updated);
      return updated;
    },
    [token]
  );

  const updateUserPassword = useCallback(
    async (payload: { currentPassword: string; newPassword: string }) => {
      if (!token) throw new Error('Unauthorized');
      await changePassword(payload, token);
    },
    [token]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      isEmployee: user?.role === 'employee',
      isCreator: user?.role === 'creator',
      login,
      register,
      logout,
      refreshMe,
      updateUserProfile,
      updateUserPassword
    }),
    [token, user, loading, login, register, logout, refreshMe, updateUserProfile, updateUserPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
