// src/hooks/useLessons.js
import { useState, useCallback } from 'react';
import { LessonApi } from '../api/lesson.api';

export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await LessonApi.getAll();
      setLessons(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки уроков';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLesson = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LessonApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки урока';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Creating lesson with data:', data);
      const response = await LessonApi.create(data);
      console.log('📥 Create response:', response.data);
      await fetchLessons();
      return response.data;
    } catch (err) {
      console.error('❌ Create error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      const message = err.response?.data?.message || 'Ошибка создания урока';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLessons]);

  const updateLesson = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Updating lesson:', id, 'with data:', data);
      const response = await LessonApi.update(id, data);
      console.log('📥 Update response:', response.data);
      await fetchLessons();
      return response.data;
    } catch (err) {
      console.error('❌ Update error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      const message = err.response?.data?.message || 'Ошибка обновления урока';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLessons]);

  const deleteLesson = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deleting lesson:', id);
      await LessonApi.delete(id);
      await fetchLessons();
    } catch (err) {
      console.error('❌ Delete error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      const message = err.response?.data?.message || 'Ошибка удаления урока';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson
  };
};