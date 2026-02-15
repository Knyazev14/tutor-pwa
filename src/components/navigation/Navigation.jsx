// src/components/navigation/Navigation.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ padding: '15px', background: '#f0f0f0', display: 'flex', gap: '20px' }}>
      <Link to="/tutor-pwa">🏠 Главная</Link>
      <Link to="/books">📚 Брони</Link>  {/* ← добавляем ссылку */}
      
      {isAuthenticated ? (
        <>
          <span>👤 {user?.username || 'Пользователь'}</span>
          <button onClick={logout}>🚪 Выйти</button>
        </>
      ) : (
        <Link to="/login">🔐 Войти</Link>
      )}
    </nav>
  );
}

export default Navigation;