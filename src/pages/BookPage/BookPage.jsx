import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingCard from '../../components/ui/BookingCard';
import BookingModal from '../../components/ui/BookingModal';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const API_BASE = 'https://cors-anywhere.herokuapp.com/http://kattylrj.beget.tech/api/v1/book';

function BookPage() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  
  const { isAuthenticated, logout, authHeader } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBooks();
    fetchStudents();
    fetchCategories();
  }, [isAuthenticated]);

  useEffect(() => {
    filterBooks();
  }, [books, filter]);

  // API запросы
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/get`, {
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

      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/http://kattylrj.beget.tech/api/v1/student/get', {
        headers: { ...authHeader }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки учеников:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/http://kattylrj.beget.tech/api/v1/category/get', {
        headers: { ...authHeader }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const createBooking = async (bookingData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании брони');
      }

      const result = await response.json();
      await fetchBooks(); // Обновляем список
      setIsModalOpen(false);
      alert('✅ Бронь успешно создана');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const updateBooking = async (id, bookingData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении брони');
      }

      await fetchBooks(); // Обновляем список
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту бронь?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { ...authHeader }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении брони');
      }

      setBooks(prev => prev.filter(book => book.id !== id));
      alert('✅ Бронь удалена');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const booking = books.find(b => b.id === id);
    if (!booking) return;

    await updateBooking(id, {
      ...booking,
      bookStatus: newStatus
    });
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    const bookingData = {
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      bookStatus: formData.bookStatus,
      lessonFormat: formData.lessonFormat,
      studentId: parseInt(formData.studentId),
      lessonCategoryId: parseInt(formData.lessonCategoryId)
    };

    if (editingBooking) {
      updateBooking(editingBooking.id, bookingData);
    } else {
      createBooking(bookingData);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
          const end = book.endDate ? new Date(book.endDate) : null;
          return end && end < today;
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
              onClick={handleCreate}
              variant="success"
              icon={<span>➕</span>}
              size="sm"
            >
              Новая бронь
            </Button>
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
                onDelete={deleteBooking}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {books.length === 0 ? '📭 Нет данных о бронях' : '🔍 Нет броней по выбранному фильтру'}
              </p>
              {books.length === 0 && (
                <Button
                  onClick={handleCreate}
                  variant="success"
                  className="mt-4"
                >
                  ➕ Создать первую бронь
                </Button>
              )}
            </div>
          )
        )}
      </div>

      {/* Модальное окно */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        onSubmit={handleModalSubmit}
        booking={editingBooking}
        students={students}
        categories={categories}
      />

      {/* Лоадер для модалки */}
      {modalLoading && (
        <div className="fixed inset-0 bg-sky-100/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <LoadingSpinner />
          </div>
        </div>
      )}
    </Container>
  );
}

export default BookPage;