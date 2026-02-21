import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooks } from '../../hooks/useBooks';
import { useBookFilters } from '../../hooks/useBookFilters';
import { useReferenceData } from '../../hooks/useReferenceData';
import BookingCard from '../../components/ui/BookingCard';
import BookingModal from '../../components/ui/BookingModal';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function BookPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Используем хуки
  const { 
    books, 
    loading, 
    error, 
    fetchBooks, 
    createBook, 
    updateBook, 
    deleteBook 
  } = useBooks();
  
  const { students, categories, loading: refLoading } = useReferenceData();
  const { filter, setFilter, filteredBooks, getFilterButtonClass } = useBookFilters(books);
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBooking, setEditingBooking] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBooks();
  }, [isAuthenticated, navigate, fetchBooks]);

  const handleCreate = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту бронь?')) {
      return;
    }

    try {
      await deleteBook(id);
      alert('✅ Бронь удалена');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const booking = books.find(b => b.id === id);
    if (!booking) return;

    try {
      await updateBook(id, {
        ...booking,
        bookStatus: newStatus
      });
    } catch (err) {
      alert('❌ Ошибка при изменении статуса');
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
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
        await updateBook(editingBooking.id, bookingData);
        alert('✅ Бронь успешно обновлена');
      } else {
        await createBook(bookingData);
        alert('✅ Бронь успешно создана');
      }
      
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if ((loading && !books.length) || refLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
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
    </div>
  );
}

export default BookPage;