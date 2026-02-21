// src/utils/calendarHelpers.js
export const calendarHelpers = {
  formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
},
  parseBookedSlot(params) {
    const bookId = params.get('book_id');
    const studentId = params.get('student_id');
    const categoryId = params.get('category_id');
    const startDate = params.get('start_date');
    const endDate = params.get('end_date');
    const price = params.get('price');
    const name = params.get('name');
    const format = params.get('format');
    
    if (!studentId || !categoryId || !startDate || !endDate) {
      console.error('Missing required parameters for booked slot');
      return null;
    }
    
    const [startDatePart, startTimePart] = startDate.split('T');
    const [endDatePart, endTimePart] = endDate.split('T');
    
    const nameParts = name ? name.split(' - ') : [];
    const studentName = nameParts[0] || 'Ученик';
    const categoryName = nameParts[1] || 'Предмет';
    
    return {
      id: null,
      book: { id: parseInt(bookId) },
      student: { 
        id: parseInt(studentId), 
        name: studentName 
      },
      category: { 
        id: parseInt(categoryId), 
        name: categoryName 
      },
      price: parseInt(price) || 0,
      startDate: startDate.replace('T', ' '),
      endDate: endDate.replace('T', ' '),
      date: startDatePart,
      endDatePart: endDatePart,
      timeFrom: startTimePart,
      timeTo: endTimePart,
      name: name || `${studentName} - ${categoryName}`,
      lessonFormat: format || 'offline'
    };
  },

  parseFreeSlot(params) {
    const timeFrom = params.get('time_from');
    const timeTo = params.get('time_to');
    const startDate = params.get('start_date');
    
    if (!timeFrom || !startDate) {
      console.error('Missing required parameters for free slot');
      return null;
    }
    
    let endTime = timeTo;
    if (!endTime && timeFrom) {
      const [hours, minutes] = timeFrom.split(':').map(Number);
      const endHours = hours + Math.floor((minutes + 45) / 60);
      const endMinutes = (minutes + 45) % 60;
      endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
    
    return {
      id: null,
      startDate: `${startDate} ${timeFrom}:00`,
      endDate: `${startDate} ${endTime}:00`,
      date: startDate,
      endDatePart: startDate,
      timeFrom: timeFrom,
      timeTo: endTime || '--:--',
      price: 0,
      name: 'Новый урок',
      student: null,
      category: null,
      lessonFormat: 'offline'
    };
  },

  parseLessonFromServer(lesson) {
    const startDate = lesson.startDate ? lesson.startDate.split(' ') : ['', ''];
    const endDate = lesson.endDate ? lesson.endDate.split(' ') : ['', ''];
    
    return {
      id: lesson.id,
      name: lesson.name,
      startDate: lesson.startDate,
      endDate: lesson.endDate,
      date: startDate[0] || '',
      endDatePart: endDate[0] || '',
      timeFrom: startDate[1] ? startDate[1].substring(0, 5) : '',
      timeTo: endDate[1] ? endDate[1].substring(0, 5) : '',
      price: lesson.price,
      student: lesson.student,
      category: lesson.category,
      lessonStatus: lesson.lessonStatus,
      lessonFormat: lesson.lessonFormat || 'offline',
      book: lesson.book
    };
  },

  getLessonIdFromUrl(pathParts) {
    const lessonIndex = pathParts.indexOf('lesson');
    return lessonIndex > -1 && pathParts[lessonIndex + 1] 
      ? pathParts[lessonIndex + 1] 
      : null;
  },

  // Функция для определения цвета текста на основе яркости фона (резервная, если с сервера не пришел)
  getTextColor(bgColor) {
    if (!bgColor) return '#1a1e24';
    
    // Преобразуем HEX в RGB
    let r, g, b;
    
    if (bgColor.startsWith('#')) {
      const hex = bgColor.substring(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    } else {
      return '#1a1e24';
    }
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#1a1e24' : '#ffffff';
  }

  
};