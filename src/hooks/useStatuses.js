import { useState, useCallback } from 'react';
import { StatusApi } from '../api/status.api';

export const useStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StatusApi.getAll();
      setStatuses(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки статусов';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatus = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StatusApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки статуса';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStatus = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StatusApi.create(data);
      await fetchStatuses(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка создания статуса';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStatuses]);

  const updateStatus = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StatusApi.update(id, data);
      await fetchStatuses(); // Обновляем список
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка обновления статуса';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStatuses]);

  const deleteStatus = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await StatusApi.delete(id);
      await fetchStatuses(); // Обновляем список
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка удаления статуса';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStatuses]);

  return {
    statuses,
    loading,
    error,
    fetchStatuses,
    getStatus,
    createStatus,
    updateStatus,
    deleteStatus
  };
};