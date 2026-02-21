import { useState, useMemo } from 'react';

export const useCategoryFilters = (categories) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, books, lessons
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  const filteredCategories = useMemo(() => {
    if (!categories.length) return [];
    
    let filtered = [...categories];
    
    // Поиск по названию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        category.name?.toLowerCase().includes(query)
      );
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'books':
          comparison = (a.booksCount || 0) - (b.booksCount || 0);
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
  }, [categories, searchQuery, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: categories.length,
    totalBooks: categories.reduce((sum, c) => sum + (c.booksCount || 0), 0),
    totalLessons: categories.reduce((sum, c) => sum + (c.lessonsCount || 0), 0),
    averagePrice: categories.length 
      ? Math.round(categories.reduce((sum, c) => sum + (c.price || 0), 0) / categories.length)
      : 0,
    maxPrice: Math.max(...categories.map(c => c.price || 0), 0),
    minPrice: Math.min(...categories.map(c => c.price || 0), Infinity) || 0
  }), [categories]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filteredCategories,
    stats
  };
};