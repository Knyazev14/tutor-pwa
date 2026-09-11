import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Auth from '../api/auth/api.auth.js';
import { onAuthLogout } from '../api/api.config.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    try {
      Auth.logout();
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        setLoading(true);
        setError(null);
        const isValid = Auth.isAuthenticated();
        setIsAuthenticated(isValid);
        
        // Если токен невалиден, очищаем его
        if (!isValid) {
         console.log('не валид')
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
        setError(err.message);
        // Очищаем испорченный токен
       console.log('Очищаем испорченный токен')
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Выход по 401 из axios-интерцептора
  useEffect(() => {
    return onAuthLogout(() => {
      setIsAuthenticated(false);
      setError(null);
    });
  }, []);

  const login = useCallback((token) => {
    try {
      Auth.setToken(token);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout,
      error 
    }}>
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
