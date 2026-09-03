import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStatuses } from '../../hooks/useStatuses';
import { useStatusFilters } from '../../hooks/useStatusFilters';
import StatusCard from '../../components/ui/StatusCard';
import StatusModal from '../../components/ui/StatusModal';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function StatusPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Используем хуки
  const { 
    statuses, 
    loading, 
    error, 
    fetchStatuses, 
    createStatus, 
    updateStatus, 
    deleteStatus 
  } = useStatuses();
  
  const { 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    sortOrder,
    toggleSortOrder,
    filteredStatuses, 
    stats,
    getStatusColor,
    getStatusIcon
  } = useStatusFilters(statuses);
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchStatuses();
  }, [isAuthenticated, navigate, fetchStatuses]);

  const handleCreate = () => {
    setEditingStatus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот статус?')) {
      return;
    }

    try {
      await deleteStatus(id);
      alert('✅ Статус удален');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      const statusData = {
        name: formData.name,
        slug: formData.slug
      };

      if (editingStatus) {
        await updateStatus(editingStatus.id, statusData);
        alert('✅ Статус успешно обновлен');
      } else {
        await createStatus(statusData);
        alert('✅ Статус успешно создан');
      }
      
      setIsModalOpen(false);
      setEditingStatus(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if ((loading && !statuses.length)) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📊 Статусы уроков
          <span className="text-sm font-normal text-gray-500">
            ({filteredStatuses.length} из {statuses.length})
          </span>
        </h1>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            variant="success"
            icon={<span>➕</span>}
            size="sm"
          >
            Новый статус
          </Button>
          <Button
            onClick={fetchStatuses}
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Всего статусов</div>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Всего уроков</div>
          <div className="text-2xl font-bold text-green-700">{stats.totalLessons}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">В среднем на статус</div>
          <div className="text-2xl font-bold text-purple-700">{stats.averageLessons}</div>
        </div>
      </div>

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск по названию или slug..."
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
            <option value="name">По названию</option>
            <option value="slug">По slug</option>
            <option value="lessons">По урокам</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Легенда цветов */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Цветовая легенда:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-xs">Ожидание</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-xs">Оплачено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-xs">Отменено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-xs">Проведено</span>
        </div>
      </div>

      {/* Список статусов */}
      {filteredStatuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStatuses.map((status) => (
            <StatusCard
              key={status.id}
              status={status}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {statuses.length === 0 ? '📭 Нет данных о статусах' : '🔍 Нет статусов по вашему запросу'}
            </p>
            {statuses.length === 0 && (
              <Button
                onClick={handleCreate}
                variant="success"
                className="mt-4"
              >
                ➕ Создать первый статус
              </Button>
            )}
          </div>
        )
      )}

      {/* Модальное окно */}
      <StatusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStatus(null);
        }}
        onSubmit={handleModalSubmit}
        status={editingStatus}
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

export default StatusPage;