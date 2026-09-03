import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLessons } from '../../hooks/useLessons';
import { useLessonFilters } from '../../hooks/useLessonFilters';
import { useReferenceData } from '../../hooks/useReferenceData';
import LessonCard from '../../components/ui/LessonCard';
import LessonModal from '../../components/ui/LessonModal';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function LessonPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Используем хуки
  const { 
    lessons, 
    loading, 
    error, 
    fetchLessons, 
    createLesson, 
    updateLesson, 
    deleteLesson 
  } = useLessons();
  
  const { students, categories, statuses, loading: refLoading } = useReferenceData();
  const { 
    filter, 
    setFilter, 
    dateFilter, 
    setDateFilter, 
    filteredLessons, 
    getFilterButtonClass,
    stats 
  } = useLessonFilters(lessons);
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchLessons();
  }, [isAuthenticated, navigate, fetchLessons]);

  const handleCreate = () => {
    setEditingLesson(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      return;
    }

    try {
      await deleteLesson(id);
      alert('✅ Урок удален');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      const lessonData = {
        date: formData.date,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        price: formData.price ? parseInt(formData.price) : 0,
        comment: formData.comment || null,
        studentId: parseInt(formData.studentId),
        categoryId: parseInt(formData.categoryId),
        statusId: parseInt(formData.statusId)
      };

      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
        alert('✅ Урок успешно обновлен');
      } else {
        await createLesson(lessonData);
        alert('✅ Урок успешно создан');
      }
      
      setIsModalOpen(false);
      setEditingLesson(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if ((loading && !lessons.length) || refLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📚 Уроки
          <span className="text-sm font-normal text-gray-500">
            ({filteredLessons.length} из {lessons.length})
          </span>
        </h1>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            variant="success"
            icon={<span>➕</span>}
            size="sm"
          >
            Новый урок
          </Button>
          <Button
            onClick={fetchLessons}
            disabled={loading}
            variant="primary"
            icon={<span>🔄</span>}
            size="sm"
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Всего уроков</div>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600">Ожидают</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Оплачено</div>
          <div className="text-2xl font-bold text-green-700">{stats.paid}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-600">Отменено</div>
          <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={getFilterButtonClass('all')}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={getFilterButtonClass('pending')}
          >
            ⏳ Ожидание
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={getFilterButtonClass('paid')}
          >
            ✅ Оплачено
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={getFilterButtonClass('cancelled')}
          >
            ❌ Отменено
          </button>
        </div>

        {/* Фильтр по дате */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">📅 Фильтр по дате:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Список уроков */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {lessons.length === 0 ? '📭 Нет данных об уроках' : '🔍 Нет уроков по выбранному фильтру'}
            </p>
            {lessons.length === 0 && (
              <Button
                onClick={handleCreate}
                variant="success"
                className="mt-4"
              >
                ➕ Создать первый урок
              </Button>
            )}
          </div>
        )
      )}

      {/* Модальное окно */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={handleModalSubmit}
        lesson={editingLesson}
        students={students}
        categories={categories}
        statuses={statuses}
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

export default LessonPage;