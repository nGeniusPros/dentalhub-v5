import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { AddShiftModal } from './AddShiftModal';
import { ViewShiftModal } from './ViewShiftModal';
import { cn } from '../../../../../lib/utils';

interface Shift {
  id: string;
  employeeName: string;
  role: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'checked-in' | 'checked-out' | 'absent';
}

export const ShiftCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddShift, setShowAddShift] = useState(false);
  const [showViewShift, setShowViewShift] = useState<Shift | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      employeeName: 'Dr. Sarah Wilson',
      role: 'Dentist',
      startTime: '08:00',
      endTime: '14:00',
      date: '2024-03-15',
      status: 'checked-in'
    },
    {
      id: '2',
      employeeName: 'John Smith',
      role: 'Hygienist',
      startTime: '09:00',
      endTime: '15:00',
      date: '2024-03-15',
      status: 'scheduled'
    }
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add days from previous month to start on Sunday
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      days.push({ date: day, isCurrentMonth: true });
    }

    // Add days from next month to complete the calendar
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }

    return days;
  };

  const handleAddShift = (newShift: Shift) => {
    setShifts([...shifts, { ...newShift, id: Date.now().toString() }]);
    setShowAddShift(false);
  };

  const handleUpdateShift = (updatedShift: Shift) => {
    setShifts(shifts.map(shift => 
      shift.id === updatedShift.id ? updatedShift : shift
    ));
    setShowViewShift(null);
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
    setShowViewShift(null);
  };

  const days = getDaysInMonth(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
          >
            <Icons.ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
          >
            <Icons.ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={() => setShowAddShift(true)}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayShifts = shifts.filter(shift => shift.date === dateStr);

          return (
            <div
              key={index}
              className={cn(
                "bg-white p-2 min-h-[120px] relative",
                !isCurrentMonth && "bg-gray-50"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                !isCurrentMonth && "text-gray-400",
                date.toDateString() === new Date().toDateString() && "text-primary"
              )}>
                {date.getDate()}
              </span>

              <div className="mt-1 space-y-1">
                {dayShifts.map((shift) => (
                  <button
                    key={shift.id}
                    onClick={() => setShowViewShift(shift)}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded text-xs",
                      "hover:bg-gray-100 transition-colors",
                      shift.status === 'checked-in' && "bg-green-100 text-green-800",
                      shift.status === 'checked-out' && "bg-blue-100 text-blue-800",
                      shift.status === 'absent' && "bg-red-100 text-red-800",
                      shift.status === 'scheduled' && "bg-gray-100 text-gray-800"
                    )}
                  >
                    <div className="font-medium truncate">{shift.employeeName}</div>
                    <div className="text-xs opacity-75">
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AddShiftModal
        isOpen={showAddShift}
        onClose={() => setShowAddShift(false)}
        onAdd={handleAddShift}
      />

      <ViewShiftModal
        shift={showViewShift}
        onClose={() => setShowViewShift(null)}
        onUpdate={handleUpdateShift}
        onDelete={handleDeleteShift}
      />
    </div>
  );
};