import React, { useState, useEffect } from 'react';

function StatusModal({ isOpen, onClose, onSubmit, status }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name || '',
        slug: status.slug || ''
      });
    } else {
      setFormData({
        name: '',
        slug: ''
      });
    }
  }, [status]);

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
              {status ? '✏️ Редактировать статус' : '➕ Новый статус'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📊 Название статуса *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Например: Оплачено"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔗 Slug (идентификатор)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="paid"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым для автоматической генерации из названия
              </p>
            </div>

            {/* Примеры предустановленных статусов */}
            {!status && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Предустановленные статусы:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-yellow-100 p-2 rounded">⏳ Ожидание (pending)</div>
                  <div className="bg-green-100 p-2 rounded">✅ Оплачено (paid)</div>
                  <div className="bg-red-100 p-2 rounded">❌ Отменено (cancelled)</div>
                  <div className="bg-blue-100 p-2 rounded">✔️ Проведено (completed)</div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {status ? 'Сохранить' : 'Создать'}
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

export default StatusModal;