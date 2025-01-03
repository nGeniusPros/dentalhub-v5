import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

const Appointments = () => {
  const appointments = [
    { 
      date: 'Mar 15, 2024', 
      time: '10:00 AM', 
      type: 'Regular Checkup', 
      provider: 'Dr. Smith',
      member: 'Self',
      status: 'Confirmed'
    },
    { 
      date: 'Mar 20, 2024', 
      time: '2:30 PM', 
      type: 'Cleaning', 
      provider: 'Dr. Johnson',
      member: 'Sarah (Child)',
      status: 'Pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">Appointments</h1>
          <p className="text-ngenius-gray-500 mt-1">Manage your dental appointments</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-ngenius-primary rounded-lg hover:bg-ngenius-primary/90">
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-ngenius-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icons.Calendar className="w-5 h-5 text-ngenius-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ngenius-gray-900">{appointment.type}</p>
                    <p className="text-sm text-ngenius-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-sm text-ngenius-gray-500">
                      {appointment.provider} - {appointment.member}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full",
                    appointment.status === 'Confirmed' ? "text-green-700 bg-green-100" : "text-yellow-700 bg-yellow-100"
                  )}>
                    {appointment.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-sm text-ngenius-primary hover:underline">
                      Reschedule
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Appointments;