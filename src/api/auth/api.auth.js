import { instance } from "../api.config.js";

const TOKEN_KEY = 'token';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  // Не JWT / нет exp — срок жизни проверит сервер (401)
  if (!payload?.exp) return false;
  // Небольшой запас, чтобы не дергать API уже просроченным токеном
  return Date.now() >= payload.exp * 1000 - 5000;
}

const Auth = {
  login(email, password) {
    // Старый токен не должен уходить на login_check
    this.clearToken();
    return instance.post("api/login_check", { email, password });
  },

  logout() {
    this.clearToken();
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    if (isTokenExpired(token)) {
      this.clearToken();
      return false;
    }

    return true;
  },
};

export default Auth;
