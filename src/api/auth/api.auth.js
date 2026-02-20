import { instance } from "../api.config.js";

const Auth = {
  login(email, password) {
    return instance.post("api/login_check", { email, password });
  },
  
  logout() {
    localStorage.removeItem('token');
    return instance.post("/logout");
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  getToken() {
    return localStorage.getItem('token');
  }
};

export default Auth;