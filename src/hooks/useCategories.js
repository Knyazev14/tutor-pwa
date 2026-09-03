import { useState, useCallback } from 'react';
import { CategoryApi } from '../api/category.api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoryApi.getAll();
      setCategories(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки категорий';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoryApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки категории';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoryApi.create(data);
      await fetchCategories(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка создания категории';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoryApi.update(id, data);
      await fetchCategories(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка обновления категории';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryApi.delete(id);
      await fetchCategories(); // Обновляем список
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка удаления категории';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  };
};