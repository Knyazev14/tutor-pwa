import React, { useState } from 'react';
import { format, parse, isAfter, isBefore, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

function BookingCard({ booking, onStatusChange, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    id,
    timeFrom,
    timeTo,
    startDate,
    endDate,
    bookStatus,
    lessonFormat,
    student,
    lessonCategory,
    lessonsCount
  } = booking;

  // Форматирование дат
  const formatDate = (dateString) => {
    if (!dateString) return 'Бессрочно';
    try {
      const date = new Date(dateString);
      return format(date, 'd MMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  // Проверка статуса брони (активна/архивна)
  const isActive = () => {
    const today = new Date();
    const start = new Date(startDate);
    
    if (isAfter(today, start)) {
      if (endDate) {
        const end = new Date(endDate);
        return !isAfter(today, end);
      }
      return true;
    }
    return false;
  };

  const active = isActive();

  // Получение цвета для статуса
  const getStatusColor = () => {
    if (!active) return 'bg-gray-100 border-gray-300';
    return bookStatus ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300';
  };

  // Получение иконки для формата занятия
  const getFormatIcon = () => {
    return lessonFormat === 'online' ? '💻' : '🏫';
  };

  // Получение иконки для статуса
  const getStatusIcon = () => {
    if (!active) return '📦';
    return bookStatus ? '✅' : '⏳';
  };

  // Получение текста статуса
  const getStatusText = () => {
    if (!active) return 'Архивная';
    return bookStatus ? 'Активна' : 'Ожидание';
  };

  return (
    <div 
      className={`
        relative border-2 rounded-xl p-5 transition-all duration-300
        ${getStatusColor()}
        ${isExpanded ? 'shadow-lg scale-[1.02]' : 'shadow hover:shadow-md'}
      `}
    >
      {/* Верхняя полоска с ID и статусом */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded-full">
            #{id}
          </span>
          <span className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${active ? (bookStatus ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800') 
                     : 'bg-gray-200 text-gray-600'}
          `}>
            {getStatusIcon()} {getStatusText()}
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
        {/* Ученик и предмет */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <span>👤</span>
            <span className="font-medium">{student?.name || 'Без имени'}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            <span>📚</span>
            <span>{lessonCategory?.name || 'Без категории'}</span>
          </div>
        </div>

        {/* Время и формат */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span>⏰</span>
            <span>{timeFrom} — {timeTo}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span>{getFormatIcon()}</span>
            <span className="capitalize">
              {lessonFormat === 'online' ? 'Онлайн' : 'Офлайн'}
            </span>
          </div>
        </div>

        {/* Даты */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <span>📅</span>
            <span>С {formatDate(startDate)}</span>
          </div>
          
          {endDate && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>➡️</span>
              <span>По {formatDate(endDate)}</span>
            </div>
          )}
        </div>

        {/* Количество занятий */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">📊 Занятий:</span>
          <span className="font-bold text-lg text-blue-600">{lessonsCount || 0}</span>
        </div>

        {/* Действия (показываются при раскрытии) */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2 flex-wrap">
            {onStatusChange && (
              <button
                onClick={() => onStatusChange(id, !bookStatus)}
                className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                {bookStatus ? '🔴 Приостановить' : '🟢 Активировать'}
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(booking)}
                className="flex-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                ✏️ Редактировать
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCard;