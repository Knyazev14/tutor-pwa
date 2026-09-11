import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudents } from '../../hooks/useStudents';
import { useStudentFilters } from '../../hooks/useStudentFilters';
import StudentCard from '../../components/ui/StudentCard';
import StudentModal from '../../components/ui/StudentModal';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Хелпер: ученик в архиве, если comment строго равен "0"
const isArchived = (student) => String(student?.comment ?? '').trim() === '0';

function StudentPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Используем хуки
  const {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  } = useStudents();

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredStudents,
    stats
  } = useStudentFilters(students);

  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  // Режим отображения: "active" или "archive"
  const [viewMode, setViewMode] = React.useState('active');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchStudents();
  }, [isAuthenticated, navigate, fetchStudents]);

  // Разделяем учеников на активных и архивных
  const activeStudents = useMemo(
    () => filteredStudents.filter((s) => !isArchived(s)),
    [filteredStudents]
  );

  const archivedStudents = useMemo(
    () => filteredStudents.filter((s) => isArchived(s)),
    [filteredStudents]
  );

  // То, что реально показываем
  const visibleStudents = viewMode === 'archive' ? archivedStudents : activeStudents;

  // Пересчёт статистики для активных учеников
  const activeStats = useMemo(() => {
    const list = students.filter((s) => !isArchived(s));
    return {
      total: list.length,
      withBooks: list.filter((s) => (s.bookingsCount || 0) > 0).length,
      withLessons: list.filter((s) => (s.lessonsCount || 0) > 0).length,
      totalLessons: list.reduce((sum, s) => sum + (s.lessonsCount || 0), 0),
    };
  }, [students]);

  const handleCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого ученика?')) {
      return;
    }

    try {
      await deleteStudent(id);
      alert('✅ Ученик удален');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      const studentData = {
        name: formData.name,
        comment: formData.comment || null
      };

      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData);
        alert('✅ Ученик успешно обновлен');
      } else {
        await createStudent(studentData);
        alert('✅ Ученик успешно создан');
      }

      setIsModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading && !students.length) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {viewMode === 'archive' ? '📦 Архив учеников' : '👥 Ученики'}
          <span className="text-sm font-normal text-gray-500">
            ({visibleStudents.length} из {viewMode === 'archive' ? archivedStudents.length : activeStudents.length})
          </span>
        </h1>

        <div className="flex flex-wrap gap-2">
          {/* Переключатель Архив / Активные */}
          <Button
            onClick={() => setViewMode(viewMode === 'archive' ? 'active' : 'archive')}
            variant={viewMode === 'archive' ? 'primary' : 'secondary'}
            icon={<span>{viewMode === 'archive' ? '👥' : '📦'}</span>}
            size="sm"
          >
            {viewMode === 'archive'
              ? 'К активным'
              : `Архив${archivedStudents.length ? ` (${archivedStudents.length})` : ''}`}
          </Button>

          {viewMode === 'active' && (
            <Button
              onClick={handleCreate}
              variant="success"
              icon={<span>➕</span>}
              size="sm"
            >
              Новый ученик
            </Button>
          )}

          <Button
            onClick={fetchStudents}
            disabled={loading}
            variant="primary"
            icon={<span>🔄</span>}
            size="sm"
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* Статистика (показываем только для активных) */}
      {viewMode === 'active' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Всего учеников</div>
            <div className="text-2xl font-bold text-blue-700">{activeStats.total}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">С бронями</div>
            <div className="text-2xl font-bold text-green-700">{activeStats.withBooks}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">С уроками</div>
            <div className="text-2xl font-bold text-purple-700">{activeStats.withLessons}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600">Всего уроков</div>
            <div className="text-2xl font-bold text-orange-700">{activeStats.totalLessons}</div>
          </div>
        </div>
      )}

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск по имени или комментарию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="name">По имени</option>
            <option value="date">По дате</option>
            <option value="lessons">По урокам</option>
          </select>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Список студентов */}
      {visibleStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {viewMode === 'archive'
                ? '📦 Архив пуст'
                : students.length === 0
                  ? '📭 Нет данных об учениках'
                  : '🔍 Нет учеников по вашему запросу'}
            </p>
            {viewMode === 'active' && activeStudents.length === 0 && (
              <Button
                onClick={handleCreate}
                variant="success"
                className="mt-4"
              >
                ➕ Создать первого ученика
              </Button>
            )}
          </div>
        )
      )}

      {/* Модальное окно */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleModalSubmit}
        student={editingStudent}
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

export default StudentPage;