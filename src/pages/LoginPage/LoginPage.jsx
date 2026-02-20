import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Auth from '../../api/auth/api.auth.js';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function LoginPage() {
  const [email, setEmail] = useState('tutor@gmail.com');
  const [password, setPassword] = useState('tutor1488');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Используем Auth вместо fetch
      const response = await Auth.login(email, password);
      const { token } = response.data;
      
      if (token) {
        login(token); // Токен уже сохранится в localStorage через AuthContext
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Вход в систему</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← На главную
          </Link>
        </div>
      </Card>
  );
}

export default LoginPage;