import { useState, useMemo } from 'react';

export const useStatusFilters = (statuses) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, slug, lessons
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredStatuses = useMemo(() => {
    if (!statuses.length) return [];
    
    let filtered = [...statuses];
    
    // Поиск по названию или slug
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(status => 
        status.name?.toLowerCase().includes(query) ||
        status.slug?.toLowerCase().includes(query)
      );
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'slug':
          comparison = (a.slug || '').localeCompare(b.slug || '');
          break;
        case 'lessons':
          comparison = (a.lessonsCount || 0) - (b.lessonsCount || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [statuses, searchQuery, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: statuses.length,
    totalLessons: statuses.reduce((sum, s) => sum + (s.lessonsCount || 0), 0),
    averageLessons: statuses.length 
      ? Math.round(statuses.reduce((sum, s) => sum + (s.lessonsCount || 0), 0) / statuses.length)
      : 0,
    maxLessons: Math.max(...statuses.map(s => s.lessonsCount || 0), 0)
  }), [statuses]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Цвета для разных статусов
  const getStatusColor = (slug) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'paid': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'completed': 'bg-blue-100 text-blue-800 border-blue-300',
      'default': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[slug] || colors.default;
  };

  const getStatusIcon = (slug) => {
    const icons = {
      'pending': '⏳',
      'paid': '✅',
      'cancelled': '❌',
      'completed': '✔️',
      'default': '📊'
    };
    return icons[slug] || icons.default;
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filteredStatuses,
    stats,
    getStatusColor,
    getStatusIcon
  };
};