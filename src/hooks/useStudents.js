import { useState, useCallback } from 'react';
import { StudentApi } from '../api/student.api';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getAll();
      setStudents(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки студентов';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки студента';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.create(data);
      await fetchStudents(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка создания студента';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  const updateStudent = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StudentApi.update(id, data);
      await fetchStudents(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка обновления студента';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  const deleteStudent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await StudentApi.delete(id);
      await fetchStudents(); // Обновляем список
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка удаления студента';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    fetchStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
  };
};