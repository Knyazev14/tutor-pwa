import { useState, useCallback } from 'react';
import { useLessons } from './useLessons';
import { calendarHelpers } from '../utils/calendarHelpers';

export const useCalendarModal = (onSuccess) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { createLesson, updateLesson, getLesson } = useLessons();

  const openModal = useCallback((lesson = null) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingLesson(null);
  }, []);

  const handleEventClick = useCallback(async (info) => {
    info.jsEvent.preventDefault();
    
    const event = info.event;
    if (!event.url) return;
    
    try {
      const url = new URL(event.url, window.location.origin);
      const params = new URLSearchParams(url.search);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      // Если есть book_id - это слот для создания урока из брони
      if (params.has('book_id')) {
        openModal(calendarHelpers.parseBookedSlot(params));
      } 
      // Если есть id в пути - это существующий урок
      else if (pathParts.includes('lesson') && pathParts.length > 1) {
        const lessonId = calendarHelpers.getLessonIdFromUrl(pathParts);
        if (lessonId && !isNaN(parseInt(lessonId))) {
          setModalLoading(true);
          const lessonData = await getLesson(parseInt(lessonId));
          openModal(lessonData);
          setModalLoading(false);
        }
      }
      // Свободный слот
      else if (pathParts.includes('book') && pathParts.includes('new')) {
        openModal(calendarHelpers.parseFreeSlot(params));
      }
    } catch (err) {
      console.error('Error handling event click:', err);
    }
  }, [openModal, getLesson]);

  const handleModalSubmit = useCallback(async (formData) => {
    setModalLoading(true);
    try {
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

      if (editingLesson?.book?.id) {
        lessonData.bookId = editingLesson.book.id;
      }

      if (editingLesson?.id) {
        await updateLesson(editingLesson.id, lessonData);
      } else {
        await createLesson(lessonData);
      }
      
      onSuccess?.();
      closeModal();
    } catch (err) {
      throw err;
    } finally {
      setModalLoading(false);
    }
  }, [editingLesson, createLesson, updateLesson, onSuccess, closeModal]);

  return {
    isModalOpen,
    editingLesson,
    modalLoading,
    openModal,
    closeModal,
    handleEventClick,
    handleModalSubmit
  };
};