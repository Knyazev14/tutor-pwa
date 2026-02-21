// src/hooks/useCalendar.js
import { useState, useCallback } from 'react';
import { CalendarApi } from '../api/calendar.api';

export const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const fetchEvents = useCallback(async (startDate = null, endDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const formattedStart = startDate ? formatDate(startDate) : null;
      const formattedEnd = endDate ? formatDate(endDate) : null;
      
      
      const response = await CalendarApi.getEvents(formattedStart, formattedEnd);
      setEvents(Array.isArray(response.data) ? response.data : []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка загрузки событий';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventsWithEndDate = useCallback((startDate, endDate) => {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    return fetchEvents(startDate, adjustedEndDate);
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventsWithEndDate
  };
};