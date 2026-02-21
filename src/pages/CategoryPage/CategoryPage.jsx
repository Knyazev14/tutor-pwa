import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { useCategoryFilters } from '../../hooks/useCategoryFilters';
import CategoryCard from '../../components/ui/CategoryCard';
import CategoryModal from '../../components/ui/CategoryModal';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function CategoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Используем хуки
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();
  
  const { 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    sortOrder,
    toggleSortOrder,
    filteredCategories, 
    stats 
  } = useCategoryFilters(categories);
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate, fetchCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await deleteCategory(id);
      alert('✅ Категория удалена');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      const categoryData = {
        name: formData.name,
        price: parseInt(formData.price) || 0,
        slug: formData.slug
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        alert('✅ Категория успешно обновлена');
      } else {
        await createCategory(categoryData);
        alert('✅ Категория успешно создана');
      }
      
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if ((loading && !categories.length)) {
    return <LoadingSpinner fullScreen />;
  }

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price || 0);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📚 Категории уроков
          <span className="text-sm font-normal text-gray-500">
            ({filteredCategories.length} из {categories.length})
          </span>
        </h1>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            variant="success"
            icon={<span>➕</span>}
            size="sm"
          >
            Новая категория
          </Button>
          <Button
            onClick={fetchCategories}
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
          <div className="text-sm text-blue-600">Всего категорий</div>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Средняя цена</div>
          <div className="text-2xl font-bold text-green-700">{formatPrice(stats.averagePrice)} р</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-orange-600">Мин. цена</div>
          <div className="text-2xl font-bold text-orange-700">{formatPrice(stats.minPrice)} р</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">Макс. цена</div>
          <div className="text-2xl font-bold text-purple-700">{formatPrice(stats.maxPrice)} р</div>
        </div>
      </div>

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
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
            <option value="price">По цене</option>
            <option value="books">По броням</option>
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

      {/* Список категорий */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {categories.length === 0 ? '📭 Нет данных о категориях' : '🔍 Нет категорий по вашему запросу'}
            </p>
            {categories.length === 0 && (
              <Button
                onClick={handleCreate}
                variant="success"
                className="mt-4"
              >
                ➕ Создать первую категорию
              </Button>
            )}
          </div>
        )
      )}

      {/* Модальное окно */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleModalSubmit}
        category={editingCategory}
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

export default CategoryPage;