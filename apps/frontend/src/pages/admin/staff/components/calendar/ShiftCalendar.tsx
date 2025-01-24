import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'regular' | 'overtime' | 'on-call';
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface CalendarDay {
  date: Date;
  shifts: Shift[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const ShiftCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days for the current month
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const today = new Date();
    const days: CalendarDay[] = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        shifts: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        shifts: generateMockShifts(date), // In real app, this would come from API
        isCurrentMonth: true,
        isToday: 
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        shifts: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const generateMockShifts = (date: Date): Shift[] => {
    // This is mock data - in a real app, this would come from your backend
    if (Math.random() > 0.7) { // Only generate shifts for some days
      return [
        {
          id: `shift-${date.getTime()}-1`,
          staffId: '1',
          staffName: 'Dr. Sarah Wilson',
          date: date.toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '17:00',
          type: 'regular',
          status: 'scheduled',
        },
      ];
    }
    return [];
  };

  const calendarDays = getDaysInMonth(currentDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <Icons.ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <Icons.ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.01 }}
            className={cn(
              'min-h-[100px] p-2 bg-white dark:bg-gray-800 relative',
              !day.isCurrentMonth && 'bg-gray-50 dark:bg-gray-900',
              day.isToday && 'bg-blue-50 dark:bg-blue-900/20',
              selectedDate?.toDateString() === day.date.toDateString() &&
                'ring-2 ring-primary ring-inset'
            )}
            onClick={() => setSelectedDate(day.date)}
          >
            <span
              className={cn(
                'text-sm',
                !day.isCurrentMonth && 'text-gray-400 dark:text-gray-600',
                day.isToday && 'text-blue-600 dark:text-blue-400 font-semibold'
              )}
            >
              {day.date.getDate()}
            </span>

            {/* Shifts for the day */}
            <div className="mt-1 space-y-1">
              {day.shifts.map((shift) => (
                <div
                  key={shift.id}
                  className={cn(
                    'text-xs p-1 rounded',
                    shift.type === 'regular' && 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                    shift.type === 'overtime' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                    shift.type === 'on-call' && 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                  )}
                >
                  <div className="font-medium truncate">{shift.staffName}</div>
                  <div>{shift.startTime} - {shift.endTime}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
