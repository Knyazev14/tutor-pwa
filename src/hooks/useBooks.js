import { useState, useCallback } from 'react';
import { BookApi } from '../api/book.api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookApi.getAll();
      setBooks(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки броней';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBook = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки брони';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookApi.create(data);
      await fetchBooks(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка создания брони';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  const updateBook = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookApi.update(id, data);
      await fetchBooks(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка обновления брони';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  const deleteBook = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await BookApi.delete(id);
      await fetchBooks(); // Обновляем список
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка удаления брони';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
  };
};