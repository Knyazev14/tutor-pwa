// src/components/ui/LessonModal.jsx
import React, { useState, useEffect } from 'react';

function LessonModal({ isOpen, onClose, onSubmit, lesson, students, categories, statuses }) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    timeFrom: '',
    timeTo: '',
    price: '',
    studentId: '',
    categoryId: '',
    statusId: '',
    lessonFormat: 'offline'
  });

  useEffect(() => {
    if (lesson) {
      console.log('Setting lesson data:', lesson);
      
      // Если есть startDate в формате "2026-02-23 10:00"
      let startDate = '';
      let endDate = '';
      let timeFrom = '';
      let timeTo = '';
      
      if (lesson.startDate) {
        if (lesson.startDate.includes('T')) {
          // Формат "2026-02-23T10:00"
          const [datePart, timePart] = lesson.startDate.split('T');
          startDate = datePart;
          timeFrom = timePart;
        } else if (lesson.startDate.includes(' ')) {
          // Формат "2026-02-23 10:00"
          const [datePart, timePart] = lesson.startDate.split(' ');
          startDate = datePart;
          timeFrom = timePart.substring(0, 5);
        } else {
          startDate = lesson.startDate;
        }
      }
      
      if (lesson.endDate) {
        if (lesson.endDate.includes('T')) {
          // Формат "2026-02-23T10:45"
          const [datePart, timePart] = lesson.endDate.split('T');
          endDate = datePart;
          timeTo = timePart;
        } else if (lesson.endDate.includes(' ')) {
          // Формат "2026-02-23 10:45"
          const [datePart, timePart] = lesson.endDate.split(' ');
          endDate = datePart;
          timeTo = timePart.substring(0, 5);
        } else {
          endDate = lesson.endDate;
        }
      }

      setFormData({
        name: lesson.name || '',
        startDate: startDate || lesson.date || '',
        endDate: endDate || lesson.endDatePart || '',
        timeFrom: timeFrom || lesson.timeFrom || '',
        timeTo: timeTo || lesson.timeTo || '',
        price: lesson.price || '',
        studentId: lesson.student?.id || '',
        categoryId: lesson.category?.id || '',
        statusId: lesson.lessonStatus?.id || lesson.status?.id || '',
        lessonFormat: lesson.lessonFormat || 'offline'
      });
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        timeFrom: '',
        timeTo: '',
        price: '',
        studentId: '',
        categoryId: '',
        statusId: '',
        lessonFormat: 'offline'
      });
    }
  }, [lesson]);

  // Автоматическое формирование названия при выборе ученика и предмета
  useEffect(() => {
    if (isOpen && formData.studentId && formData.categoryId && !formData.name) {
      const selectedStudent = students?.find(s => s.id === parseInt(formData.studentId));
      const selectedCategory = categories?.find(c => c.id === parseInt(formData.categoryId));
      
      if (selectedStudent && selectedCategory) {
        setFormData(prev => ({
          ...prev,
          name: `${selectedStudent.name} - ${selectedCategory.name}`
        }));
      }
    }
  }, [isOpen, formData.studentId, formData.categoryId, formData.name, students, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Формируем startDate и endDate в формате для сервера
    const startDateTime = formData.startDate && formData.timeFrom 
      ? `${formData.startDate} ${formData.timeFrom}:00` 
      : null;
    
    const endDateTime = formData.endDate && formData.timeTo 
      ? `${formData.endDate} ${formData.timeTo}:00` 
      : null;

    const submitData = {
      name: formData.name,
      startDate: startDateTime,
      endDate: endDateTime,
      price: formData.price ? parseInt(formData.price) : 0,
      studentId: parseInt(formData.studentId),
      categoryId: parseInt(formData.categoryId),
      statusId: parseInt(formData.statusId),
      lessonFormat: formData.lessonFormat
    };

    // Если есть bookId из брони, добавляем его
    if (lesson?.book?.id) {
      submitData.bookId = lesson.book.id;
    }
    
    console.log('Submitting lesson data:', submitData);
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-sky-100/70 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {lesson ? '✏️ Редактировать урок' : '➕ Новый урок'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Название урока */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Название урока *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Название урока"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ученик */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👤 Ученик *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите ученика</option>
                {students?.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Предмет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📚 Предмет *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите предмет</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.price}р
                  </option>
                ))}
              </select>
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📊 Статус *
              </label>
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите статус</option>
                {statuses?.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Формат занятия */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏫 Формат занятия
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lessonFormat"
                    value="offline"
                    checked={formData.lessonFormat === 'offline'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  🏫 Офлайн
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lessonFormat"
                    value="online"
                    checked={formData.lessonFormat === 'online'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  💻 Онлайн
                </label>
              </div>
            </div>

            {/* Дата начала */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Дата начала *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Дата завершения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Дата завершения
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым, если урок однодневный
              </p>
            </div>

            {/* Время */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⏰ Время с *
                </label>
                <input
                  type="time"
                  name="timeFrom"
                  value={formData.timeFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⏰ Время до *
                </label>
                <input
                  type="time"
                  name="timeTo"
                  value={formData.timeTo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Цена */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💰 Цена
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="Стоимость урока"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {lesson ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LessonModal;