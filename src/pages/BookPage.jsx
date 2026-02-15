import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BookPage() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  const { token, authHeader, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBooks();
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/calendar/get', {
        headers: { ...authHeader }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Ошибка загрузки данных');
      }

      const jsonData = await response.json();
      // Извлекаем данные о бронях (books)
      const booksData = jsonData.books || jsonData.data || jsonData;
      setBooks(booksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(books, null, 2));
    alert('✅ Данные скопированы!');
  };

  if (loading && !books) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок и кнопки */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0 }}>📚 Брони ({books?.length || 0})</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchBooks}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#8936FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Обновить
          </button>
          
          {books && books.length > 0 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '8px 16px',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showAll ? '📋 Сокращенно' : '🔍 Показать все'}
            </button>
          )}
          
          {books && books.length > 0 && (
            <button 
              onClick={copyToClipboard}
              style={{
                padding: '8px 16px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Копировать
            </button>
          )}
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div style={{ 
          padding: '15px', 
          background: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Данные */}
      {books && books.length > 0 ? (
        <div style={{ 
          background: '#1e1e1e', 
          borderRadius: '8px',
          padding: '20px'
        }}>
          <pre style={{ 
            color: '#d4d4d4',
            margin: 0,
            maxHeight: showAll ? '800px' : '400px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {JSON.stringify(showAll ? books : books.slice(0, 5), null, 2)}
          </pre>
          
          {!showAll && books.length > 5 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '15px',
              color: '#888'
            }}>
              ... и еще {books.length - 5} записей
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            📭 Нет данных о бронях
          </div>
        )
      )}
    </div>
  );
}

export default BookPage;