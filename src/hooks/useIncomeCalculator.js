// src/hooks/useIncomeCalculator.js
import { useState, useCallback, useEffect } from 'react';

export const useIncomeCalculator = (events, currentPeriod) => {
  const [income, setIncome] = useState({
    planned: 0,
    received: 0,
    total: 0,
    remaining: 0,
    period: currentPeriod
  });

  const calculateIncome = useCallback(() => {
    if (!events || !Array.isArray(events) || events.length === 0) {
      setIncome({
        planned: 0,
        received: 0,
        total: 0,
        remaining: 0,
        period: currentPeriod
      });
      return;
    }
    
    let planned = 0;
    let received = 0;
    
    // Для статистики по статусам
    const stats = {
      booked: { count: 0, total: 0 },
      lesson: {
        paid: { count: 0, total: 0 },
        paidedClosed: { count: 0, total: 0 },
        pending: { count: 0, total: 0 },
        nopaidedClosed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
        other: { count: 0, total: 0 }
      }
    };

    events.forEach((event, index) => {
      const extendedProps = event.extendedProps || {};
      const type = extendedProps.type;
      const status = extendedProps.status;
      
      // Определяем цену в зависимости от типа события
      let price = 0;
      
      if (type === 'booked') {
        // Для броней цена в поле price
        price = extendedProps.price || 0;
        planned += price;
        stats.booked.count++;
        stats.booked.total += price;
      } 
      else if (type === 'lesson') {
        // Для уроков цена в поле price_paid
        price = extendedProps.price_paid || 0;
        
        // Классифицируем по статусу
        if (status === 'paid') {
          received += price;
          stats.lesson.paid.count++;
          stats.lesson.paid.total += price;
        } 
        else if (status === 'paided-closed') {
          received += price;
          stats.lesson.paidedClosed.count++;
          stats.lesson.paidedClosed.total += price;
        }
        else if (status === 'pending') {
          stats.lesson.pending.count++;
          stats.lesson.pending.total += price;
        }
        else if (status === 'nopaided-closed') {
          stats.lesson.nopaidedClosed.count++;
          stats.lesson.nopaidedClosed.total += price;
        }
        else if (status === 'cancelled') {
          stats.lesson.cancelled.count++;
          stats.lesson.cancelled.total += price;
        }
      }
    });


    setIncome({
      planned,
      received,
      total: planned + received,
      remaining: planned - received,
      period: currentPeriod
    });
  }, [events, currentPeriod]);

  useEffect(() => {
    calculateIncome();
  }, [events, currentPeriod, calculateIncome]);

  return {
    income,
    recalculate: calculateIncome
  };
};