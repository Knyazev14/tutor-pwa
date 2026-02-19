import React, { useState, useEffect } from 'react';

function LessonModal({ isOpen, onClose, onSubmit, lesson, students, categories, statuses }) {
  const [formData, setFormData] = useState({
    date: '',
    timeFrom: '',
    timeTo: '',
    price: '',
    comment: '',
    studentId: '',
    categoryId: '',
    statusId: ''
  });

  useEffect(() => {
    if (lesson) {
      // Для редактирования извлекаем данные из lesson
      let date = lesson.date || '';
      let timeFrom = lesson.timeFrom || '';
      let timeTo = lesson.timeTo || '';
      
      // Если есть startDate в формате "2026-01-17 12:00:00"
      if (lesson.startDate && !date) {
        const [datePart, timePart] = lesson.startDate.split(' ');
        date = datePart || '';
        timeFrom = timePart ? timePart.substring(0, 5) : '';
      }
      
      // Если есть endDate в формате "2026-01-17 12:40:00"
      if (lesson.endDate && !timeTo) {
        const [, timePart] = lesson.endDate.split(' ');
        timeTo = timePart ? timePart.substring(0, 5) : '';
      }

      setFormData({
        date: date,
        timeFrom: timeFrom,
        timeTo: timeTo,
        price: lesson.price || '',
        comment: lesson.comment || '',
        studentId: lesson.student?.id || '',
        categoryId: lesson.category?.id || '',
        statusId: lesson.status?.id || ''
      });
    } else {
      setFormData({
        date: '',
        timeFrom: '',
        timeTo: '',
        price: '',
        comment: '',
        studentId: '',
        categoryId: '',
        statusId: ''
      });
    }
  }, [lesson]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Подготавливаем данные для отправки
    const submitData = {
      date: formData.date,
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      price: formData.price ? parseInt(formData.price) : 0,
      comment: formData.comment || null,
      studentId: parseInt(formData.studentId),
      categoryId: parseInt(formData.categoryId),
      statusId: parseInt(formData.statusId)
    };
    
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
    <div className="fixed inset-0 bg-sky-100/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                    {category.name} - {category.price}₽
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

            {/* Дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Дата *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              <p className="text-xs text-gray-500 mt-1">
                Статус оплаты выбирается в поле "Статус"
              </p>
            </div>

            {/* Комментарий */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Дополнительная информация..."
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