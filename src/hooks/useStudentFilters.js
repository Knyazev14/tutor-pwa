import { useState, useMemo } from 'react';

export const useStudentFilters = (students) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, lessons

  const filteredStudents = useMemo(() => {
    if (!students.length) return [];
    
    let filtered = [...students];
    
    // Поиск по имени
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name?.toLowerCase().includes(query) ||
        student.comment?.toLowerCase().includes(query)
      );
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'lessons':
          return (b.lessonsCount || 0) - (a.lessonsCount || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [students, searchQuery, sortBy]);

  const stats = useMemo(() => ({
    total: students.length,
    withBooks: students.filter(s => s.bookingsCount > 0).length,
    withLessons: students.filter(s => s.lessonsCount > 0).length,
    totalBookings: students.reduce((sum, s) => sum + (s.bookingsCount || 0), 0),
    totalLessons: students.reduce((sum, s) => sum + (s.lessonsCount || 0), 0)
  }), [students]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredStudents,
    stats
  };
};