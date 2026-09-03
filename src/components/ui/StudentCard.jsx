import React, { useState } from 'react';

function StudentCard({ student, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative border-2 rounded-xl p-5 transition-all duration-300 bg-white border-gray-200 hover:shadow-md">
      {/* Верхняя полоска с ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-full">
            #{student.id}
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
        {/* Имя и иконка */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <h3 className="font-bold text-lg">{student.name || 'Без имени'}</h3>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="text-blue-600 font-bold">{student.bookingsCount || 0}</div>
            <div className="text-xs text-gray-600">Броней</div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <div className="text-green-600 font-bold">{student.lessonsCount || 0}</div>
            <div className="text-xs text-gray-600">Уроков</div>
          </div>
        </div>

        {/* Комментарий */}
        {student.comment && (
          <div className="text-sm text-gray-500 italic border-t pt-2 mt-2">
            📝 {student.comment}
          </div>
        )}

        {/* Действия (показываются при раскрытии) */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(student)}
                className="flex-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                ✏️ Редактировать
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(student.id)}
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

export default StudentCard;