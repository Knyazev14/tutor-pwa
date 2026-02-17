import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingCard from '../../components/ui/BookingCard';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function BookPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive, online, offline
  
  const { isAuthenticated, logout, authHeader } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBooks();
  }, [isAuthenticated]);

  useEffect(() => {
    filterBooks();
  }, [books, filter]);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/http://kattylrj.beget.tech/api/calendar/get', {
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
      const booksData = jsonData.books || jsonData.data || jsonData;
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];
    
    const today = new Date();
    
    switch (filter) {
      case 'active':
        filtered = filtered.filter(book => {
          const start = new Date(book.startDate);
          if (book.endDate) {
            const end = new Date(book.endDate);
            return start <= today && end >= today;
          }
          return start <= today;
        });
        break;
      case 'inactive':
        filtered = filtered.filter(book => {
          const start = new Date(book.startDate);
          if (book.endDate) {
            const end = new Date(book.endDate);
            return end < today;
          }
          return false;
        });
        break;
      case 'online':
        filtered = filtered.filter(book => book.lessonFormat === 'online');
        break;
      case 'offline':
        filtered = filtered.filter(book => book.lessonFormat === 'offline');
        break;
      default:
        break;
    }
    
    setFilteredBooks(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    // Здесь можно добавить API вызов для изменения статуса
    console.log('Change status:', id, newStatus);
    
    // Оптимистичное обновление UI
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, bookStatus: newStatus } : book
      )
    );
  };

  const handleEdit = (booking) => {
    console.log('Edit booking:', booking);
    // Навигация на страницу редактирования или открытие модалки
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту бронь?')) {
      console.log('Delete booking:', id);
      // Здесь API вызов для удаления
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    }
  };

  const getFilterButtonClass = (filterValue) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      filter === filterValue
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  if (loading && !books.length) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Заголовок и кнопки */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📚 Бронирования
            <span className="text-sm font-normal text-gray-500">
              ({filteredBooks.length} из {books.length})
            </span>
          </h1>
          
          <div className="flex gap-2">
            <Button
              onClick={fetchBooks}
              disabled={loading}
              variant="primary"
              icon={<span>🔄</span>}
              size="sm"
            >
              Обновить
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={getFilterButtonClass('all')}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('active')}
            className={getFilterButtonClass('active')}
          >
            ✅ Активные
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={getFilterButtonClass('inactive')}
          >
            📦 Архивные
          </button>
          <button
            onClick={() => setFilter('online')}
            className={getFilterButtonClass('online')}
          >
            💻 Онлайн
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={getFilterButtonClass('offline')}
          >
            🏫 Офлайн
          </button>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-50 text-danger p-4 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Список карточек */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {books.length === 0 ? '📭 Нет данных о бронях' : '🔍 Нет броней по выбранному фильтру'}
              </p>
            </div>
          )
        )}
      </div>
    </Container>
  );
}

export default BookPage;