import { useState, useMemo } from 'react';

export const useLessonFilters = (lessons) => {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Получение slug статуса из объекта
  const getStatusSlug = (lesson) => {
    return lesson.status?.slug || lesson.status?.name?.toLowerCase() || '';
  };

  const filteredLessons = useMemo(() => {
    if (!lessons.length) return [];
    
    let filtered = [...lessons];
    
    // Фильтр по статусу (используем slug)
    if (filter !== 'all') {
      filtered = filtered.filter(lesson => {
        const statusSlug = getStatusSlug(lesson);
        return statusSlug === filter;
      });
    }
    
    // Фильтр по дате (извлекаем дату из startDate)
    if (dateFilter) {
      filtered = filtered.filter(lesson => {
        if (!lesson.startDate) return false;
        const lessonDate = lesson.startDate.split(' ')[0];
        return lessonDate === dateFilter;
      });
    }
    
    // Сортировка по дате (сначала новые)
    filtered.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
      return dateB - dateA;
    });
    
    return filtered;
  }, [lessons, filter, dateFilter]);

  const getFilterButtonClass = (filterValue) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      filter === filterValue
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  // Статистика
  const stats = useMemo(() => ({
    total: lessons.length,
    pending: lessons.filter(l => getStatusSlug(l) === 'pending').length,
    paid: lessons.filter(l => getStatusSlug(l) === 'paid').length,
    completed: lessons.filter(l => getStatusSlug(l) === 'completed').length,
    cancelled: lessons.filter(l => getStatusSlug(l) === 'cancelled').length,
    totalIncome: lessons.reduce((sum, l) => sum + (l.price || 0), 0),
    totalPaid: lessons.reduce((sum, l) => sum + (l.pricePaid || 0), 0)
  }), [lessons]);

  return {
    filter,
    setFilter,
    dateFilter,
    setDateFilter,
    filteredLessons,
    getFilterButtonClass,
    stats
  };
};