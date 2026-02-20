import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LessonCard from '../../components/ui/LessonCard';
import LessonModal from '../../components/ui/LessonModal';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const API_BASE = 'http://kattylrj.beget.tech/api/v1';

function LessonPage() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  
  const { isAuthenticated, logout, authHeader } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchLessons();
    fetchStudents();
    fetchCategories();
    fetchStatuses();
  }, [isAuthenticated]);

  useEffect(() => {
    filterLessons();
  }, [lessons, filter, dateFilter]);

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/lesson/get`, {
        headers: { ...authHeader }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Ошибка загрузки уроков');
      }

      const data = await response.json();
      console.log('Lessons data:', data);
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/student/get`, {
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
      const response = await fetch(`${API_BASE}/category/get`, {
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

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE}/status/get`, {
        headers: { ...authHeader }
      });
      if (response.ok) {
        const data = await response.json();
        setStatuses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки статусов:', err);
    }
  };

  const createLesson = async (lessonData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lesson/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(lessonData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании урока');
      }

      await fetchLessons();
      setIsModalOpen(false);
      alert('✅ Урок успешно создан');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const updateLesson = async (id, lessonData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lesson/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(lessonData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении урока');
      }

      await fetchLessons();
      setIsModalOpen(false);
      setEditingLesson(null);
      alert('✅ Урок успешно обновлен');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lesson/delete/${id}`, {
        method: 'DELETE',
        headers: { ...authHeader }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении урока');
      }

      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      alert('✅ Урок удален');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLesson(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    const lessonData = {
      date: formData.date,
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      price: formData.price ? parseInt(formData.price) : 0,
      pricePaid: formData.pricePaid ? parseInt(formData.pricePaid) : 0,
      comment: formData.comment || null,
      studentId: parseInt(formData.studentId),
      categoryId: parseInt(formData.categoryId),
      statusId: parseInt(formData.statusId)
    };

    if (editingLesson) {
      updateLesson(editingLesson.id, lessonData);
    } else {
      createLesson(lessonData);
    }
  };

  // Получение slug статуса из объекта
  const getStatusSlug = (lesson) => {
    return lesson.status?.slug || lesson.status?.name?.toLowerCase() || '';
  };

  // Получение имени статуса
  const getStatusName = (lesson) => {
    return lesson.status?.name || 'Без статуса';
  };

  const filterLessons = () => {
    let filtered = [...lessons];
    
    // Фильтр по статусу (используем slug)
    if (filter !== 'all') {
      filtered = filtered.filter(lesson => {
        const statusSlug = getStatusSlug(lesson);
        return statusSlug === filter;
      });
    }
    
    // Фильтр по дате (извлекаем дату из startDate)
    if (dateFilter) {
      filtered = filtered.filter(lesson => {
        if (!lesson.startDate) return false;
        const lessonDate = lesson.startDate.split(' ')[0]; // берем только YYYY-MM-DD
        return lessonDate === dateFilter;
      });
    }
    
    // Сортировка по дате (сначала новые)
    filtered.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
      return dateB - dateA;
    });
    
    setFilteredLessons(filtered);
  };

  const getFilterButtonClass = (filterValue) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      filter === filterValue
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  // Статистика (используем slug)
  const stats = {
    total: lessons.length,
    pending: lessons.filter(l => getStatusSlug(l) === 'pending').length,
    paid: lessons.filter(l => getStatusSlug(l) === 'paid').length,
    completed: lessons.filter(l => getStatusSlug(l) === 'completed').length,
    cancelled: lessons.filter(l => getStatusSlug(l) === 'cancelled').length,
    totalIncome: lessons.reduce((sum, l) => sum + (l.price || 0), 0),
    totalPaid: lessons.reduce((sum, l) => sum + (l.pricePaid || 0), 0)
  };

  if (loading && !lessons.length) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
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
                onDelete={deleteLesson}
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
      </div>

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
    </Container>
  );
}

export default LessonPage;