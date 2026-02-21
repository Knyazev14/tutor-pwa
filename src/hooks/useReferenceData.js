// src/hooks/useReferenceData.js
import { useState, useEffect } from 'react';
import { StudentApi } from '../api/student.api';
import { CategoryApi } from '../api/category.api';
import { StatusApi } from '../api/status.api';

export const useReferenceData = () => {
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        
        const [studentsRes, categoriesRes, statusesRes] = await Promise.all([
          StudentApi.getAll(),
          CategoryApi.getAll(),
          StatusApi.getAll()
        ]);

        if (isMounted) {
          setStudents(studentsRes.data || []);
          setCategories(categoriesRes.data || []);
          setStatuses(statusesRes.data || []);
        }
      } catch (err) {
        console.error('Error loading reference data:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Ошибка загрузки справочников');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    students,
    categories,
    statuses,
    loading,
    error
  };
};