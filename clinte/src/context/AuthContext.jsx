/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  changePassword as changePasswordApi,
  fetchMe,
  loginUser,
  registerUser,
  updateProfile as updateProfileApi,
} from '../config/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'novaro_auth_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    let isMounted = true;

    async function loadMe() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchMe(token);
        if (!isMounted) return;
        setUser(profile);
      } catch {
        if (!isMounted) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken('');
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMe();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback(async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    if (!token) throw new Error('Unauthorized');
    const updatedUser = await updateProfileApi(payload, token);
    setUser(updatedUser);
    return updatedUser;
  }, [token]);

  const changePassword = useCallback(async (payload) => {
    if (!token) throw new Error('Unauthorized');
    return changePasswordApi(payload, token);
  }, [token]);

  const value = useMemo(
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
      updateProfile,
      changePassword,
    }),
    [token, user, loading, login, register, logout, updateProfile, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

