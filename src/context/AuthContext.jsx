import React, { createContext, useState, useContext, useEffect } from 'react';
import Auth from '../api/auth/api.auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    setIsAuthenticated(Auth.isAuthenticated());
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Auth.logout();
    setIsAuthenticated(false);
  };

  // authHeader больше не нужен, так как интерцептор сам добавляет токен!

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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