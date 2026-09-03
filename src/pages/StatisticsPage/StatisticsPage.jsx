import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { useFullStatistics } from '../../hooks/useFullStatistics';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

// Цвета для диаграмм
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function StatisticsPage() {
  const [period, setPeriod] = useState('all');
  const [chartType, setChartType] = useState('pie'); // pie, bar, line
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

// Функция для получения дат периода
const getDateRange = () => {
  const now = new Date();
  let startDate = null;
  let endDate = null;

  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      
      // Используем локальное форматирование вместо toISOString
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      
      return {
        start: formatLocalDate(startDate),
        end: formatLocalDate(endDate)
      };
      
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return {
        start: formatLocalDate(startDate),
        end: formatLocalDate(endDate)
      };
      
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      
      return {
        start: formatLocalDate(startDate),
        end: formatLocalDate(endDate)
      };
      
    default:
      return {
        start: null,
        end: null
      };
  }
};

  const { start, end } = getDateRange();
  const { statistics, loading, error, refetch } = useFullStatistics(start, end);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'BYN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num || 0);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'month': return 'за текущий месяц';
      case 'quarter': return 'за текущий квартал';
      case 'year': return 'за текущий год';
      default: return 'за все время';
    }
  };

  // Подготовка данных для круговой диаграммы доходов
  const getIncomePieData = () => {
    if (!statistics?.summary) return [];
    return [
      { name: 'Оплачено', value: statistics.summary.paidIncome, color: '#10b981' },
      { name: 'Ожидает', value: statistics.summary.pendingIncome, color: '#f59e0b' },
      { name: 'Отменено', value: statistics.summary.cancelledIncome, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  // Подготовка данных для круговой диаграммы по категориям
  const getCategoryPieData = () => {
    if (!statistics?.categories) return [];
    return statistics.categories.slice(0, 5).map((cat, index) => ({
      name: cat.name,
      value: cat.total,
      color: COLORS[index % COLORS.length]
    }));
  };

  // Подготовка данных для столбчатой диаграммы по месяцам
  const getMonthlyBarData = () => {
    if (!statistics?.monthly) return [];
    return statistics.monthly.map(month => ({
      name: month.name.split(' ')[0].slice(0, 3), // Сокращаем название месяца
      полный: month.name,
      Оплачено: month.paid,
      Ожидает: month.pending,
      Отменено: month.cancelled,
      Всего: month.total
    }));
  };

  // Подготовка данных для линейной диаграммы трендов
  const getTrendData = () => {
    if (!statistics?.monthly) return [];
    return statistics.monthly.map(month => ({
      name: month.name.split(' ')[0].slice(0, 3),
      доход: month.paid,
      план: month.pending,
      уроки: month.lessonsCount
    }));
  };

  // Подготовка данных для рейтинга учеников (круговая)
  const getStudentPieData = () => {
    if (!statistics?.students) return [];
    return statistics.students.slice(0, 5).map((student, index) => ({
      name: student.name.length > 15 ? student.name.slice(0, 15) + '...' : student.name,
      value: student.totalPaid,
      color: COLORS[index % COLORS.length]
    }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Загрузка статистики..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          ❌ Ошибка: {error}
        </div>
        <Button onClick={refetch} className="mt-4">
          Повторить
        </Button>
      </div>
    );
  }

  const { summary, categories, students, monthly, tax } = statistics;
  const incomePieData = getIncomePieData();
  const categoryPieData = getCategoryPieData();
  const monthlyBarData = getMonthlyBarData();
  const trendData = getTrendData();
  const studentPieData = getStudentPieData();

  // Кастомный тултип для графиков
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">📊 Полная статистика</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Все время
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Месяц
          </button>
        </div>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-blue-100 text-sm mb-1">Всего заработано</div>
          <div className="text-3xl font-bold">{formatMoney(summary.totalIncome)}</div>
          <div className="text-blue-100 text-xs mt-2">{getPeriodLabel()}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-green-100 text-sm mb-1">Оплачено</div>
          <div className="text-3xl font-bold">{formatMoney(summary.paidIncome)}</div>
          <div className="text-green-100 text-xs mt-2">{summary.paidLessons} уроков</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-yellow-100 text-sm mb-1">Ожидает оплаты</div>
          <div className="text-3xl font-bold">{formatMoney(summary.pendingIncome)}</div>
          <div className="text-yellow-100 text-xs mt-2">{summary.pendingLessons} уроков</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-red-100 text-sm mb-1">Отменено</div>
          <div className="text-3xl font-bold">{formatMoney(summary.cancelledIncome)}</div>
          <div className="text-red-100 text-xs mt-2">{summary.cancelledLessons} уроков</div>
        </div>
      </div>

      {/* Налоги */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-purple-800 text-sm mb-1">Налог 10%</div>
          <div className="text-3xl font-bold text-purple-900">{formatMoney(tax.amount)}</div>
          <div className="text-purple-600 text-xs mt-2">от оплаченных доходов</div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <div className="text-indigo-800 text-sm mb-1">Чистый доход</div>
          <div className="text-3xl font-bold text-indigo-900">{formatMoney(tax.netIncome)}</div>
          <div className="text-indigo-600 text-xs mt-2">после вычета налогов</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-gray-800 text-sm mb-1">Количество</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summary.lessonsCount)}</div>
              <div className="text-xs text-gray-600">уроков</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summary.booksCount)}</div>
              <div className="text-xs text-gray-600">броней</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summary.studentsCount)}</div>
              <div className="text-xs text-gray-600">учеников</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summary.categoriesCount)}</div>
              <div className="text-xs text-gray-600">категорий</div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок с диаграммами */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Круговая диаграмма по категориям */}
        {categoryPieData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📚 Топ категорий</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Круговая диаграмма учеников */}
        {studentPieData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">👑 Топ учеников</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {studentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Столбчатая диаграмма по месяцам */}
        {monthlyBarData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📊 Доходы по месяцам</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Оплачено" fill="#10b981" />
                  <Bar dataKey="Ожидает" fill="#f59e0b" />
                  <Bar dataKey="Отменено" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Доходы по категориям (детализация) */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">📚 Доходы по категориям (детально)</h2>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-600">{formatMoney(category.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(category.total / summary.totalIncome) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>уроков: {category.lessonsCount}</span>
                  <span>оплачено: {formatMoney(category.paid)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Рейтинг учеников (детализация) */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">👑 Топ учеников по оплатам (детально)</h2>
          <div className="space-y-3">
            {students.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-xs text-gray-500">
                      {student.lessonsCount} уроков • Последний: {new Date(student.lastLesson).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatMoney(student.totalPaid)}</div>
                  <div className="text-xs text-gray-500">
                    {((student.totalPaid / summary.paidIncome) * 100).toFixed(1)}% от всех оплат
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsPage;