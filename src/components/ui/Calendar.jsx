import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LessonModal from '../../components/ui/LessonModal';

const API_BASE = 'http://kattylrj.beget.tech/api/v1';

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Состояния для модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Данные для модалки
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  const calendarRef = useRef(null);
  const { isAuthenticated, logout, authHeader } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStudents();
    fetchCategories();
    fetchStatuses();
    
    // Небольшая задержка чтобы календарь успел инициализироваться
    setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        fetchEventsWithEndDate(calendarApi.view.currentStart, calendarApi.view.currentEnd);
      } else {
        fetchEvents();
      }
    }, 100);
  }, [isAuthenticated]);

  const fetchEventsWithEndDate = (startDate, endDate) => {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    fetchEvents(startDate, adjustedEndDate);
  };

  const fetchEvents = async (startDate = null, endDate = null) => {
    setLoading(true);
    setError('');
    
    try {
      let url = `${API_BASE}/calendar/`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('start', formatDate(startDate));
      if (endDate) params.append('end', formatDate(endDate));
      if (params.toString()) url += '?' + params.toString();
      
      console.log('Fetching events:', url);
      
      const response = await fetch(url, { headers: { ...authHeader } });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Ошибка загрузки событий');
      }

      const data = await response.json();
      console.log('Events loaded:', data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/student/get`, { headers: { ...authHeader } });
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки учеников:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category/get`, { headers: { ...authHeader } });
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE}/status/get`, { headers: { ...authHeader } });
      if (response.ok) {
        const data = await response.json();
        setStatuses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки статусов:', err);
    }
  };

  const createLesson = async (lessonData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lesson/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(lessonData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании урока');
      }

      await fetchEvents();
      setIsModalOpen(false);
      setEditingLesson(null);
      alert('✅ Урок успешно создан');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const updateLesson = async (id, lessonData) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lesson/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(lessonData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении урока');
      }

      await fetchEvents();
      setIsModalOpen(false);
      setEditingLesson(null);
      alert('✅ Урок успешно обновлен');
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEventClick = async (info) => {
    info.jsEvent.preventDefault(); // ОТМЕНЯЕМ ПЕРЕХОД ПО ССЫЛКЕ
    
    const event = info.event;
    console.log('Clicked event:', event);
    console.log('Event URL:', event.url);
    
    if (!event.url) return;
    
    try {
      const url = new URL(event.url, window.location.origin);
      const params = new URLSearchParams(url.search);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      console.log('URL parts:', pathParts);
      console.log('URL params:', Object.fromEntries(params));
      
      // Если есть book_id - это слот для создания урока из брони
      if (params.has('book_id')) {
        const bookId = params.get('book_id');
        const studentId = params.get('student_id');
        const categoryId = params.get('category_id');
        const startDate = params.get('start_date');
        const price = params.get('price');
        const name = params.get('name');
        
        // Разбираем start_date (формат: YYYY-MM-DDTHH:mm)
        const [datePart, timePart] = startDate.split('T');
        
        // Вычисляем время окончания (по умолчанию +45 минут)
        const [hours, minutes] = timePart.split(':').map(Number);
        const endHours = hours + Math.floor((minutes + 45) / 60);
        const endMinutes = (minutes + 45) % 60;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        
        setEditingLesson({
          id: null,
          book: { id: parseInt(bookId) },
          student: { id: parseInt(studentId), name: name?.split(' - ')[0] || 'Ученик' },
          category: { id: parseInt(categoryId), name: name?.split(' - ')[1] || 'Предмет' },
          price: parseInt(price) || 0,
          date: datePart,
          timeFrom: timePart,
          timeTo: endTime
        });
        
        setIsModalOpen(true);
      } 
      // Если есть id в пути - это существующий урок
      else if (pathParts.includes('lesson') && pathParts.length > 1) {
        const lessonIndex = pathParts.indexOf('lesson');
        const lessonId = pathParts[lessonIndex + 1];
        
        if (lessonId && !isNaN(parseInt(lessonId))) {
          console.log('Loading lesson with ID:', lessonId);
          
          const response = await fetch(`${API_BASE}/lesson/get/${lessonId}`, {
            headers: { ...authHeader }
          });
          
          if (response.ok) {
            const lessonData = await response.json();
            console.log('Lesson data:', lessonData);
            setEditingLesson(lessonData);
            setIsModalOpen(true);
          } else {
            console.error('Ошибка загрузки урока:', response.status);
          }
        }
      }
      // Свободный слот
      else if (pathParts.includes('book') && pathParts.includes('new')) {
        const timeFrom = params.get('time_from');
        const timeTo = params.get('time_to');
        const startDate = params.get('start_date');
        
        // Вычисляем время окончания, если его нет
        let endTime = timeTo;
        if (!endTime && timeFrom) {
          const [hours, minutes] = timeFrom.split(':').map(Number);
          const endHours = hours + Math.floor((minutes + 45) / 60);
          const endMinutes = (minutes + 45) % 60;
          endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        }
        
        setEditingLesson({
          id: null,
          date: startDate,
          timeFrom: timeFrom,
          timeTo: endTime || '--:--',
          price: 0
        });
        
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error handling event click:', err);
    }
  };

  const handleModalSubmit = (formData) => {
    const lessonData = {
      date: formData.date,
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      price: parseInt(formData.price) || 0,
      comment: formData.comment || null,
      studentId: parseInt(formData.studentId),
      categoryId: parseInt(formData.categoryId),
      statusId: parseInt(formData.statusId)
    };

    // Если есть bookId, добавляем его
    if (editingLesson?.book?.id) {
      lessonData.bookId = editingLesson.book.id;
    }

    if (editingLesson?.id) {
      updateLesson(editingLesson.id, lessonData);
    } else {
      createLesson(lessonData);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleDatesSet = (dateInfo) => {
    console.log('Dates set:', dateInfo);
    const endDate = new Date(dateInfo.end);
    endDate.setDate(endDate.getDate() + 1);
    fetchEvents(dateInfo.start, endDate);
  };

  const getInitialView = () => {
    return window.innerWidth < 768 ? 'timeGridDay' : 'dayGridMonth';
  };

  const getTextColor = (bgColor) => {
    if (!bgColor) return '#000000';
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#000000' : '#ffffff';
  };

  if (loading && !events.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">📅 Расписание</h1>
        
        <button
          onClick={() => {
            if (calendarRef.current) {
              const calendarApi = calendarRef.current.getApi();
              fetchEventsWithEndDate(calendarApi.view.currentStart, calendarApi.view.currentEnd);
            }
          }}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : '🔄 Обновить'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          ❌ {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={getInitialView()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          timeZone="local"
          locale={ruLocale}
          firstDay={1}
          buttonText={{
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            list: 'Список'
          }}
          allDaySlot={false}
          slotMinTime="09:00"
          slotMaxTime="20:00"
          nowIndicator={true}
          editable={false}
          selectable={false}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            return (
              <div className="p-1 text-xs" style={{ color: getTextColor(event.backgroundColor) }}>
                <div className="font-bold truncate">{event.title}</div>
                <div className="text-xs opacity-90">
                  {event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Модальное окно для урока */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={handleModalSubmit}
        lesson={editingLesson}
        students={students}
        categories={categories}
        statuses={statuses}
      />

      {/* Лоадер для модалки */}
      {modalLoading && (
        <div className="fixed inset-0 bg-sky-100/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;