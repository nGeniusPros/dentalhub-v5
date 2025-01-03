import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { ShiftCalendar } from '../calendar/ShiftCalendar';
import { cn } from '../../../../../lib/utils';

export const ScheduleTab = () => {
  const todayShifts = [
    {
      id: '1',
      employeeName: 'Dr. Sarah Wilson',
      role: 'Lead Dentist',
      startTime: '08:00',
      endTime: '14:00',
      status: 'checked-in'
    },
    {
      id: '2',
      employeeName: 'John Smith',
      role: 'Dental Hygienist',
      startTime: '09:00',
      endTime: '15:00',
      status: 'scheduled'
    },
    {
      id: '3',
      employeeName: 'Emily Parker',
      role: 'Front Desk',
      startTime: '10:00',
      endTime: '16:00',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Staff Schedule</h2>
          <p className="text-sm text-gray-500">Manage staff shifts and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Today's Shifts */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Shifts</h3>
        <div className="space-y-4">
          {todayShifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{shift.employeeName}</p>
                  <p className="text-sm text-gray-500">{shift.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-gray-500">Time: </span>
                  <span className="font-medium">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
                <span className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  shift.status === 'checked-in' && "bg-green-100 text-green-800",
                  shift.status === 'scheduled' && "bg-blue-100 text-blue-800",
                  shift.status === 'pending' && "bg-yellow-100 text-yellow-800"
                )}>
                  {shift.status.replace('-', ' ').charAt(0).toUpperCase() + 
                   shift.status.slice(1).replace('-', ' ')}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Icons.Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <ShiftCalendar />
    </div>
  );
};