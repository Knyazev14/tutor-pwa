import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      setToken(savedToken);
      try {
        // Декодируем токен (payload - вторая часть)
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error('Ошибка декодирования токена');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser(payload);
    } catch (e) {
      console.error('Ошибка декодирования токена');
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  // Хелпер для заголовков с токеном
  const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      login,
      logout,
      authHeader,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);