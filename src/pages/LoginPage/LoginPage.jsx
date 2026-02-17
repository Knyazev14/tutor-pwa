import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';

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
      const response = await fetch('https://cors-anywhere.herokuapp.com/http://kattylrj.beget.tech/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.token) {
        login(data.token);
        navigate('/tutor-pwa');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="small">
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Вход в систему</h2>
        
        {error && (
          <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm">
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
              className="input-field"
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
              className="input-field"
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
          <Link to="/tutor-pwa" className="text-primary-500 hover:text-primary-600 text-sm">
            ← На главную
          </Link>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;