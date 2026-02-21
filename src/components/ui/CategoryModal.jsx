import React, { useState, useEffect } from 'react';

function CategoryModal({ isOpen, onClose, onSubmit, category }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    slug: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        price: category.price || '',
        slug: category.slug || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        slug: ''
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Генерируем slug из имени, если не указан
    const slug = formData.slug || 
      formData.name.toLowerCase()
        .replace(/[^а-яa-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    
    onSubmit({
      ...formData,
      price: parseInt(formData.price) || 0,
      slug
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-sky-100/70 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {category ? '✏️ Редактировать категорию' : '➕ Новая категория'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📚 Название категории *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Например: Математика"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Цена */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💰 Цена занятия
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug (для URL) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔗 Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="matematika"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым для автоматической генерации
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {category ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;