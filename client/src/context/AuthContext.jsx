import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('blog_app_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth state on initial mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await authAPI.getMe();
          setUser(data.user);
        } catch (err) {
          console.error('Failed to load user token:', err.message);
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('blog_app_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (credentials) => {
    setError(null);
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('blog_app_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('blog_app_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
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
