import axios from 'axios';

// Базовый URL из .env
const API_BASE = import.meta.env.VITE_API_URL

// Создаем экземпляр axios с базовыми настройками
export const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const AUTH_LOGOUT_EVENT = 'auth:logout';

export function onAuthLogout(callback) {
  window.addEventListener(AUTH_LOGOUT_EVENT, callback);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, callback);
}

function emitAuthLogout() {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
}

function isLoginRequest(config) {
  const url = config?.url || '';
  return url.includes('login_check');
}

// Интерцептор для добавления токена
instance.interceptors.request.use(
  (config) => {
    if (isLoginRequest(config)) {
      // Логин всегда без старого Bearer — иначе просроченный токен ломает вход
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// При 401 сбрасываем сессию, чтобы не зависать в «залогиненном» состоянии
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint = isLoginRequest(error.config);

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      emitAuthLogout();
    }

    return Promise.reject(error);
  }
);
