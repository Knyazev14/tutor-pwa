import React, { useState } from 'react';

function CategoryCard({ category, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price || 0);
  };

  return (
    <div className="relative border-2 rounded-xl p-5 transition-all duration-300 bg-white border-gray-200 hover:shadow-md">
      {/* Верхняя полоска с ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-full">
            #{category.id}
          </span>
        </div>
        
        {/* Кнопка раскрытия */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Основная информация */}
      <div className="space-y-3">
        {/* Название и иконка */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h3 className="font-bold text-lg">{category.name || 'Без названия'}</h3>
            <div className="text-sm text-gray-500">ID: {category.id}</div>
          </div>
        </div>

        {/* Цена */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600">Цена занятия</div>
          <div className="text-2xl font-bold text-green-700">
            {formatPrice(category.price)} р
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="text-blue-600 font-bold">{category.booksCount || 0}</div>
            <div className="text-xs text-gray-600">Броней</div>
          </div>
          <div className="bg-orange-50 p-2 rounded-lg text-center">
            <div className="text-orange-600 font-bold">{category.lessonsCount || 0}</div>
            <div className="text-xs text-gray-600">Уроков</div>
          </div>
        </div>

        {/* Действия (показываются при раскрытии) */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                className="flex-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                ✏️ Редактировать
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(category.id)}
                className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        )}
      </div>

      {/* Индикатор активности */}
      {category.booksCount > 0 && (
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Активна
          </span>
        </div>
      )}
    </div>
  );
}

export default CategoryCard;