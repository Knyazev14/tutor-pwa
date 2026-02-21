// src/pages/CalendarPage/Calendar.jsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../../hooks/useCalendar';
import { useLessons } from '../../hooks/useLessons';
import { useReferenceData } from '../../hooks/useReferenceData';
import { useIncomeCalculator } from '../../hooks/useIncomeCalculator';
import { calendarHelpers } from '../../utils/calendarHelpers';
import IncomeStats from '../../components/ui/IncomeStats';
import LessonModal from '../../components/ui/LessonModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Calendar() {
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Используем хуки
  const { events, loading, error, fetchEvents, fetchEventsWithEndDate } = useCalendar();
  const { students, categories, statuses, loading: refLoading } = useReferenceData();
  const { getLesson, createLesson, updateLesson } = useLessons();
  
  // Состояния
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState({ start: null, end: null });

  // Калькулятор доходов
  const { income } = useIncomeCalculator(events, currentPeriod);

  // Функция для получения первого и последнего дня месяца
  const getMonthBoundaries = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // 0 дает последний день предыдущего месяца
    
    return { firstDay, lastDay };
  }, []);

  // Функция для загрузки данных
  const loadDataForPeriod = useCallback(async (start, end) => {
    if (!start || !end) return;
    
    // Получаем границы месяца из start даты
    const { firstDay, lastDay } = getMonthBoundaries(start);
    
    // Для календаря используем точные границы месяца
    const calendarStartStr = calendarHelpers.formatDate(firstDay);
    const calendarEndStr = calendarHelpers.formatDate(lastDay);
    
    // Для доходов используем тот же период
    const incomeStartStr = calendarStartStr;
    const incomeEndStr = calendarEndStr;

    
    // Сохраняем текущий период
    setCurrentPeriod({ start: incomeStartStr, end: incomeEndStr });
    
    // Для API календаря нужно end + 1 день (для включения последнего дня)
    const endDateForCalendar = new Date(lastDay);
    endDateForCalendar.setDate(endDateForCalendar.getDate() + 1);
    
    // Загружаем события календаря
    await fetchEvents(firstDay, endDateForCalendar);
  }, [fetchEvents, getMonthBoundaries]);

  // Обработчик смены дат в календаре
  const handleDatesSet = useCallback(async (dateInfo) => {
    await loadDataForPeriod(dateInfo.start, dateInfo.end);
  }, [loadDataForPeriod]);

  // Ручное обновление
  const handleRefresh = useCallback(async () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      await loadDataForPeriod(calendarApi.view.currentStart, calendarApi.view.currentEnd);
    }
  }, [loadDataForPeriod]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const timer = setTimeout(async () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        await loadDataForPeriod(calendarApi.view.currentStart, calendarApi.view.currentEnd);
      } else {
        await fetchEvents();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, fetchEvents, loadDataForPeriod]);

  const handleEventClick = useCallback(async (info) => {
    info.jsEvent.preventDefault();
    
    const event = info.event;
    if (!event.url) return;
    
    try {
      const url = new URL(event.url, window.location.origin);
      const params = new URLSearchParams(url.search);
      const pathParts = url.pathname.split('/').filter(Boolean);
  
      
      if (params.has('book_id')) {
        const lessonData = calendarHelpers.parseBookedSlot(params);
        if (!lessonData) {
          alert('❌ Ошибка: не удалось распарсить данные слота');
          return;
        }
        setEditingLesson(lessonData);
        setIsModalOpen(true);
      } 
      else if (pathParts.includes('lesson') && pathParts.length > 1) {
        const lessonId = calendarHelpers.getLessonIdFromUrl(pathParts);
        if (lessonId && !isNaN(parseInt(lessonId))) {
          setModalLoading(true);
          try {
            const lessonData = await getLesson(parseInt(lessonId));
            setEditingLesson(lessonData);
            setIsModalOpen(true);
          } catch (err) {
            alert('❌ Ошибка при загрузке урока');
          } finally {
            setModalLoading(false);
          }
        }
      }
      else if (pathParts.includes('book') && pathParts.includes('new')) {
        const lessonData = calendarHelpers.parseFreeSlot(params);
        if (!lessonData) {
          alert('❌ Ошибка: не удалось распарсить данные слота');
          return;
        }
        setEditingLesson(lessonData);
        setIsModalOpen(true);
      }
    } catch (err) {
      alert('❌ Ошибка при открытии слота');
    }
  }, [getLesson]);

  const handleModalSubmit = useCallback(async (formData) => {
    setModalLoading(true);
    try {
      
      let startDate = '';
      let endDate = '';
      let timeFrom = '';
      let timeTo = '';
      
      if (formData.startDate) {
        if (formData.startDate.includes(' ')) {
          const [datePart, timePart] = formData.startDate.split(' ');
          startDate = datePart;
          timeFrom = timePart.substring(0, 5);
        } else {
          startDate = formData.startDate;
        }
      }
      
      if (formData.endDate) {
        if (formData.endDate.includes(' ')) {
          const [datePart, timePart] = formData.endDate.split(' ');
          endDate = datePart;
          timeTo = timePart.substring(0, 5);
        } else {
          endDate = formData.endDate;
        }
      }
      
      if (!timeFrom && formData.timeFrom) timeFrom = formData.timeFrom;
      if (!timeTo && formData.timeTo) timeTo = formData.timeTo;
      
      if (!formData.name) throw new Error('Введите название урока');
      if (!formData.studentId) throw new Error('Выберите ученика');
      if (!formData.categoryId) throw new Error('Выберите предмет');
      if (!formData.statusId) throw new Error('Выберите статус');
      if (!startDate) throw new Error('Укажите дату начала');
      if (!timeFrom || !timeTo) throw new Error('Укажите время начала и окончания');
      
      const lessonData = {
        name: formData.name,
        startDate: `${startDate} ${timeFrom}:00`,
        endDate: endDate ? `${endDate} ${timeTo}:00` : null,
        price: formData.price ? parseInt(formData.price) : 0,
        studentId: parseInt(formData.studentId),
        categoryId: parseInt(formData.categoryId),
        statusId: parseInt(formData.statusId),
        lessonFormat: formData.lessonFormat || 'offline'
      };

      if (editingLesson?.book?.id) {
        lessonData.bookId = editingLesson.book.id;
      }

      if (editingLesson?.id) {
        await updateLesson(editingLesson.id, lessonData);
        alert('✅ Урок успешно обновлен');
      } else {
        await createLesson(lessonData);
        alert('✅ Урок успешно создан');
      }
      
      // Обновляем данные после сохранения
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        await loadDataForPeriod(calendarApi.view.currentStart, calendarApi.view.currentEnd);
      }
      
      setIsModalOpen(false);
      setEditingLesson(null);
    } catch (err) {
      alert(`❌ Ошибка: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  }, [editingLesson, createLesson, updateLesson, loadDataForPeriod]);


  if ((loading && !events.length) || refLoading) {
    return <LoadingSpinner fullScreen message="Загрузка расписания..." />;
  }

  return (
    <div className="min-[600px]:p-4">
      {/* Компонент доходов */}
      <IncomeStats 
        income={income}
        loading={loading}
        onRefresh={handleRefresh}
      />

      {/* Заголовок и кнопка обновления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">📅 Расписание</h1>
        
        <button
          onClick={handleRefresh}
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

      <div className="bg-white rounded-lg shadow-lg min-[600px]:p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={'dayGridMonth'}
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
          showNonCurrentDates={false}  // Не показывать даты из других месяцев
          fixedWeekCount={false}
          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            const bgColor = event.backgroundColor || '#ffffff';
            const textColor = event.textColor || '#1a1e24';
            
            return (
              <div 
                className="p-1 text-xs rounded w-full h-full overflow-hidden" 
                style={{ 
                  backgroundColor: bgColor,
                  color: textColor
                }}
              >
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
            <LoadingSpinner size="md" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;