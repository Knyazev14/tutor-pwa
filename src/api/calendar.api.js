import { instance } from './api.config';

export const CalendarApi = {
  // GET /calendar/ - получение событий
  getEvents(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    
    const url = `api/v1/calendar/${params.toString() ? '?' + params.toString() : ''}`;
    return instance.get(url);
  }
};