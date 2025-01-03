import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { formatTime } from '../../../lib/utils/date';
import { AppointmentActions } from '../../../components/appointments/AppointmentActions';

export const ScheduleSection = () => {
  const appointments = [
    { time: '09:00', patient: 'John Smith', type: 'Cleaning', status: 'Confirmed' },
    { time: '10:30', patient: 'Sarah Johnson', type: 'Root Canal', status: 'Pending' },
    { time: '14:00', patient: 'Mike Davis', type: 'Consultation', status: 'Confirmed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
          <Icons.Calendar className="w-4 h-4 mr-2" />
          View Full Schedule
        </Button>
      </div>
      <div className="space-y-4">
        {appointments.map((apt, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{formatTime(apt.time)}</span>
              <span className={cn(
                "px-2 py-1 text-xs rounded-full",
                apt.status === 'Confirmed' 
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              )}>
                {apt.status}
              </span>
            </div>
            <p className="text-gray-900">{apt.patient}</p>
            <p className="text-sm text-gray-500">{apt.type}</p>
            <div className="mt-2">
              <AppointmentActions appointment={apt} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};