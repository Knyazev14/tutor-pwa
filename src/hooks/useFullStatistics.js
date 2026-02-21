import { useState, useCallback, useEffect } from 'react';
import { LessonApi } from '../api/lesson.api';
import { BookApi } from '../api/book.api';
import { StudentApi } from '../api/student.api';
import { CategoryApi } from '../api/category.api';

export const useFullStatistics = (startDate, endDate) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    // Общая статистика
    summary: {
      totalIncome: 0,        // Всего заработано
      paidIncome: 0,          // Оплачено
      pendingIncome: 0,       // Ожидает оплаты
      cancelledIncome: 0,     // Отменено
      lessonsCount: 0,
      booksCount: 0,
      activeBooksCount: 0,
      studentsCount: 0,
      categoriesCount: 0
    },
    // Доходы по категориям
    categories: [],
    // Рейтинг учеников
    students: [],
    // Статистика по месяцам
    monthly: [],
    // Налоги
    tax: {
      amount: 0,
      rate: 10,
      netIncome: 0
    }
  });

  const calculateTax = (income) => {
    const taxAmount = Math.round(income * 0.1); // 10%
    return {
      amount: taxAmount,
      rate: 10,
      netIncome: income - taxAmount
    };
  };

  const filterByDateRange = (items, dateField) => {
    if (!startDate || !endDate) return items;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching all data for statistics...');
      
      // Загружаем все данные параллельно
      const [lessonsRes, booksRes, studentsRes, categoriesRes] = await Promise.all([
        LessonApi.getAll(),
        BookApi.getAll(),
        StudentApi.getAll(),
        CategoryApi.getAll()
      ]);

      const allLessons = lessonsRes.data || [];
      const allBooks = booksRes.data || [];
      const allStudents = studentsRes.data || [];
      const allCategories = categoriesRes.data || [];

      console.log('📊 Data loaded:', {
        lessons: allLessons.length,
        books: allBooks.length,
        students: allStudents.length,
        categories: allCategories.length
      });

      // Фильтруем по дате, если указан период
      const filteredLessons = filterByDateRange(allLessons, 'startDate');
      const filteredBooks = filterByDateRange(allBooks, 'startDate');

      // Статистика по урокам
      const lessonsStats = filteredLessons.reduce((acc, lesson) => {
        const status = lesson.status?.slug || '';
        const price = lesson.price || 0;
        
        acc.total++;
        
        if (status === 'paid' || status === 'paided-closed') {
          acc.paid++;
          acc.paidIncome += price;
        } else if (status === 'pending') {
          acc.pending++;
          acc.pendingIncome += price;
        } else if (status === 'cancelled' || status === 'nopaided-closed') {
          acc.cancelled++;
          acc.cancelledIncome += price;
        }
        
        acc.totalIncome += price;
        
        return acc;
      }, {
        total: 0,
        paid: 0,
        pending: 0,
        cancelled: 0,
        paidIncome: 0,
        pendingIncome: 0,
        cancelledIncome: 0,
        totalIncome: 0
      });

      // Статистика по броням
      const booksStats = filteredBooks.reduce((acc, book) => {
        acc.total++;
        if (book.bookStatus) {
          acc.active++;
        }
        return acc;
      }, { total: 0, active: 0 });

      // Доходы по категориям
      const categoryStats = {};
      filteredLessons.forEach(lesson => {
        const categoryId = lesson.category?.id;
        const categoryName = lesson.category?.name || 'Без категории';
        const price = lesson.price || 0;
        const status = lesson.status?.slug;
        
        if (!categoryStats[categoryId]) {
          categoryStats[categoryId] = {
            id: categoryId,
            name: categoryName,
            total: 0,
            paid: 0,
            pending: 0,
            cancelled: 0,
            lessonsCount: 0
          };
        }
        
        categoryStats[categoryId].lessonsCount++;
        categoryStats[categoryId].total += price;
        
        if (status === 'paid' || status === 'paided-closed') {
          categoryStats[categoryId].paid += price;
        } else if (status === 'pending') {
          categoryStats[categoryId].pending += price;
        } else if (status === 'cancelled' || status === 'nopaided-closed') {
          categoryStats[categoryId].cancelled += price;
        }
      });

      // Рейтинг учеников
      const studentStats = {};
      filteredLessons.forEach(lesson => {
        const studentId = lesson.student?.id;
        const studentName = lesson.student?.name || 'Без имени';
        const price = lesson.price || 0;
        const status = lesson.status?.slug;
        
        if (!studentStats[studentId]) {
          studentStats[studentId] = {
            id: studentId,
            name: studentName,
            totalPaid: 0,
            lessonsCount: 0,
            lastLesson: lesson.startDate
          };
        }
        
        studentStats[studentId].lessonsCount++;
        
        if (status === 'paid' || status === 'paided-closed') {
          studentStats[studentId].totalPaid += price;
        }
        
        // Обновляем дату последнего урока
        if (lesson.startDate > studentStats[studentId].lastLesson) {
          studentStats[studentId].lastLesson = lesson.startDate;
        }
      });

      // Статистика по месяцам
      const monthlyStats = {};
      filteredLessons.forEach(lesson => {
        if (!lesson.startDate) return;
        
        const date = new Date(lesson.startDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
        const price = lesson.price || 0;
        const status = lesson.status?.slug;
        
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            key: monthKey,
            name: monthName,
            total: 0,
            paid: 0,
            pending: 0,
            cancelled: 0,
            lessonsCount: 0
          };
        }
        
        monthlyStats[monthKey].lessonsCount++;
        monthlyStats[monthKey].total += price;
        
        if (status === 'paid' || status === 'paided-closed') {
          monthlyStats[monthKey].paid += price;
        } else if (status === 'pending') {
          monthlyStats[monthKey].pending += price;
        } else if (status === 'cancelled' || status === 'nopaided-closed') {
          monthlyStats[monthKey].cancelled += price;
        }
      });

      // Преобразуем объекты в массивы и сортируем
      const categoriesArray = Object.values(categoryStats)
        .filter(c => c.total > 0)
        .sort((a, b) => b.total - a.total);
      
      const studentsArray = Object.values(studentStats)
        .filter(s => s.totalPaid > 0)
        .sort((a, b) => b.totalPaid - a.totalPaid)
        .slice(0, 20); // Топ-20 учеников
      
      const monthlyArray = Object.values(monthlyStats)
        .sort((a, b) => a.key.localeCompare(b.key));

      const totalIncome = lessonsStats.totalIncome;
      const tax = calculateTax(lessonsStats.paidIncome);

      setStatistics({
        summary: {
          totalIncome,
          paidIncome: lessonsStats.paidIncome,
          pendingIncome: lessonsStats.pendingIncome,
          cancelledIncome: lessonsStats.cancelledIncome,
          lessonsCount: lessonsStats.total,
          paidLessons: lessonsStats.paid,
          pendingLessons: lessonsStats.pending,
          cancelledLessons: lessonsStats.cancelled,
          booksCount: booksStats.total,
          activeBooks: booksStats.active,
          studentsCount: allStudents.length,
          categoriesCount: allCategories.length
        },
        categories: categoriesArray,
        students: studentsArray,
        monthly: monthlyArray,
        tax
      });

    } catch (err) {
      console.error('❌ Error fetching statistics:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
};