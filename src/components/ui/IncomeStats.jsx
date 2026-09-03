// src/components/ui/IncomeStats.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

function IncomeStats({ income, loading, onRefresh }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'BYN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Форматируем период для отображения
  const getPeriodDisplay = () => {
    if (income?.period?.start && income?.period?.end) {
      const start = new Date(income.period.start + 'T00:00:00');
      const end = new Date(income.period.end + 'T00:00:00');
      
      const startMonth = start.toLocaleString('ru-RU', { month: 'long' });
      const endMonth = end.toLocaleString('ru-RU', { month: 'long' });
      const year = start.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${year}`;
      } else {
        return `${startMonth} - ${endMonth} ${year}`;
      }
    }
    
    const now = new Date();
    const month = now.toLocaleString('ru-RU', { month: 'long' });
    const year = now.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Планируемый доход */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-100 text-sm mb-1">Планируемый доход</div>
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="text-xl flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Загрузка...
                </div>
              ) : (
                formatMoney(income?.planned || 0)
              )}
            </div>
            <div className="text-blue-100 text-xs mt-1">
              из активных броней
            </div>
          </div>
          <div className="text-4xl opacity-50">💰</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-blue-100 text-xs">
            за {getPeriodDisplay()}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-white hover:text-blue-200 transition-colors"
            title="Обновить"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Полученный доход */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-green-100 text-sm mb-1">Получено</div>
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="text-xl flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Загрузка...
                </div>
              ) : (
                formatMoney(income?.received || 0)
              )}
            </div>
            <div className="text-green-100 text-xs mt-1">
              из оплаченных уроков
            </div>
          </div>
          <div className="text-4xl opacity-50">💵</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-green-100 text-xs">
            за {getPeriodDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeStats;