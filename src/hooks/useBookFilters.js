import { useState, useMemo } from 'react';

export const useBookFilters = (books) => {
  const [filter, setFilter] = useState('all');

  const filteredBooks = useMemo(() => {
    if (!books.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = [...books];
    
    switch (filter) {
      case 'active':
        filtered = filtered.filter(book => {
          const start = new Date(book.startDate);
          if (book.endDate) {
            const end = new Date(book.endDate);
            return start <= today && end >= today;
          }
          return start <= today;
        });
        break;
        
      case 'inactive':
        filtered = filtered.filter(book => {
          const end = book.endDate ? new Date(book.endDate) : null;
          return end && end < today;
        });
        break;
        
      case 'online':
        filtered = filtered.filter(book => book.lessonFormat === 'online');
        break;
        
      case 'offline':
        filtered = filtered.filter(book => book.lessonFormat === 'offline');
        break;
        
      default:
        break;
    }
    
    return filtered;
  }, [books, filter]);

  const getFilterButtonClass = (filterValue) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      filter === filterValue
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  return {
    filter,
    setFilter,
    filteredBooks,
    getFilterButtonClass
  };
};