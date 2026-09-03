import React, { useState } from 'react';

function StatusCard({ status, onEdit, onDelete, getStatusColor, getStatusIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColor = getStatusColor?.(status.slug) || 'bg-gray-100 text-gray-800 border-gray-300';
  const statusIcon = getStatusIcon?.(status.slug) || '📊';

  return (
    <div className={`relative border-2 rounded-xl p-5 transition-all duration-300 ${statusColor}`}>
      {/* Верхняя полоска с ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded-full">
            #{status.id}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/50">
            {statusIcon} {status.slug || 'статус'}
          </span>
        </div>
        
        {/* Кнопка раскрытия */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Основная информация */}
      <div className="space-y-3">
        {/* Название и иконка */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center text-3xl">
            {statusIcon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{status.name || 'Без названия'}</h3>
            <div className="text-sm opacity-75">slug: {status.slug || '—'}</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white/30 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{status.lessonsCount || 0}</div>
              <div className="text-xs opacity-75">Уроков</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{status.booksCount || 0}</div>
              <div className="text-xs opacity-75">Броней</div>
            </div>
          </div>
        </div>

        {/* Действия (показываются при раскрытии) */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-white/30 flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(status)}
                className="flex-1 py-2 px-3 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium"
              >
                ✏️ Редактировать
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(status.id)}
                className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-700 rounded-lg transition-colors text-sm font-medium"
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

export default StatusCard;