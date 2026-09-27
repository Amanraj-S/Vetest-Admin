import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vtest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vtest_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const data = await authService.getMe();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('vtest_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('vtest_token', data.token);
      localStorage.setItem('vtest_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore error on logout cleanup
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('vtest_token');
      localStorage.removeItem('vtest_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
