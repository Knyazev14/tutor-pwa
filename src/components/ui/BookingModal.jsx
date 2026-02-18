import React, { useState, useEffect } from 'react';

function BookingModal({ isOpen, onClose, onSubmit, booking, students, categories }) {
  const [formData, setFormData] = useState({
    timeFrom: '',
    timeTo: '',
    startDate: '',
    endDate: '',
    bookStatus: true,
    lessonFormat: 'offline',
    studentId: '',
    lessonCategoryId: ''
  });

  // Заполняем форму при редактировании
  useEffect(() => {
    if (booking) {
      setFormData({
        timeFrom: booking.timeFrom || '',
        timeTo: booking.timeTo || '',
        startDate: booking.startDate || '',
        endDate: booking.endDate || '',
        bookStatus: booking.bookStatus ?? true,
        lessonFormat: booking.lessonFormat || 'offline',
        studentId: booking.student?.id || '',
        lessonCategoryId: booking.lessonCategory?.id || ''
      });
    } else {
      // Сброс формы для нового бронирования
      setFormData({
        timeFrom: '',
        timeTo: '',
        startDate: '',
        endDate: '',
        bookStatus: true,
        lessonFormat: 'offline',
        studentId: '',
        lessonCategoryId: ''
      });
    }
  }, [booking]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-sky-100/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {booking ? '✏️ Редактировать бронь' : '➕ Новая бронь'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                name="lessonCategoryId"
                value={formData.lessonCategoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите предмет</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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

            {/* Даты */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📅 Начало *
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📅 Окончание
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Формат */}
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

            {/* Статус */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bookStatus"
                  checked={formData.bookStatus}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Активное бронирование</span>
              </label>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {booking ? 'Сохранить' : 'Создать'}
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

export default BookingModal;