import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function LessonCard({ lesson, onEdit, onDelete, onStatusChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Разделяем дату и время из startDate
  const parseStartDate = () => {
    if (!lesson.startDate) return { date: '', time: '' };
    
    // Формат "2025-12-22 16:00:00"
    const [datePart, timePart] = lesson.startDate.split(' ');
    return {
      date: datePart || '',
      time: timePart ? timePart.substring(0, 5) : '' // берем только ЧЧ:ММ
    };
  };

  // Получаем время окончания из endDate
  const parseEndTime = () => {
    if (!lesson.endDate) return '';
    
    // Формат "2026-01-17 12:40:00"
    const [, timePart] = lesson.endDate.split(' ');
    return timePart ? timePart.substring(0, 5) : ''; // берем только ЧЧ:ММ
  };

  const { date, time } = parseStartDate();
  const endTime = parseEndTime();

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  // Получение статуса из объекта
  const getStatusSlug = () => {
    return lesson.status?.slug || lesson.status?.name?.toLowerCase() || '';
  };

  const getStatusName = () => {
    return lesson.status?.name || 'Без статуса';
  };

  // Получение цвета для статуса
  const getStatusColor = () => {
    const statusSlug = getStatusSlug();
    const colors = {
      'pending': 'bg-yellow-50 border-yellow-300',
      'paid': 'bg-green-50 border-green-300',
      'cancelled': 'bg-red-50 border-red-300',
      'completed': 'bg-blue-50 border-blue-300'
    };
    return colors[statusSlug] || 'bg-gray-50 border-gray-300';
  };

  // Получение цвета для бейджа статуса
  const getStatusBadgeColor = () => {
    const statusSlug = getStatusSlug();
    const colors = {
      'pending': 'bg-yellow-200 text-yellow-800',
      'paid': 'bg-green-200 text-green-800',
      'cancelled': 'bg-red-200 text-red-800',
      'completed': 'bg-blue-200 text-blue-800'
    };
    return colors[statusSlug] || 'bg-gray-200 text-gray-600';
  };

  // Получение иконки статуса
  const getStatusIcon = () => {
    const statusSlug = getStatusSlug();
    const icons = {
      'pending': '⏳',
      'paid': '✅',
      'cancelled': '❌',
      'completed': '✔️'
    };
    return icons[statusSlug] || '📊';
  };

  // Получение текста статуса
  const getStatusText = () => {
    const statusSlug = getStatusSlug();
    const texts = {
      'pending': 'Ожидание',
      'paid': 'Оплачено',
      'cancelled': 'Отменено',
      'completed': 'Проведено'
    };
    return texts[statusSlug] || getStatusName();
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
            #{lesson.id}
          </span>
          <span className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${getStatusBadgeColor()}
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
            <span className="font-medium">{lesson.student?.name || 'Без имени'}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            <span>📚</span>
            <span>{lesson.category?.name || 'Без предмета'}</span>
          </div>
        </div>

        {/* Дата и время - с началом и концом */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span>📅</span>
            <span>{formatDate(date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span>⏰</span>
            <span>
              {time || '--:--'} — {endTime || '--:--'}
            </span>
          </div>
        </div>

        {/* Цена - всегда показываем */}
        <div className="flex items-center gap-1 text-sm">
          <span>💰</span>
          <span>
            Цена: <span className="font-bold text-blue-600">{lesson.price || 0}₽</span>
            {getStatusSlug() === 'paid' && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                ✓ Оплачено
              </span>
            )}
          </span>
        </div>

        {/* Комментарий */}
        {lesson.comment && (
          <div className="text-sm text-gray-500 italic border-t pt-2 mt-2">
            📝 {lesson.comment}
          </div>
        )}

        {/* Действия (показываются при раскрытии) */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2 flex-wrap">
            {onStatusChange && (
              <button
                onClick={() => onStatusChange(lesson.id, lesson.status)}
                className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                🔄 Сменить статус
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(lesson)}
                className="flex-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                ✏️ Редактировать
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(lesson.id)}
                className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        )}
      </div>

      {/* Прогресс оплаты - только если статус не "Оплачено" */}
      {getStatusSlug() !== 'paid' && lesson.price > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-yellow-400"
            style={{ 
              width: '0%' // нет прогресса, так как не оплачено
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LessonCard;