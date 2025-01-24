import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../lib/utils';
import supabase from '../../../lib/supabase/client';
import { formatTime } from '../../../lib/utils/date';

export const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients!inner(id, first_name, last_name),
            provider:users!provider_id(id, raw_user_meta_data)
          `)
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
        } else {
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [supabase]);

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
                    {React.createElement((Icons as any).Calendar, {
                      className: "w-5 h-5 text-ngenius-primary"
                    })}
                  </div>
                  <div>
                    <p className="font-medium text-ngenius-gray-900">{appointment.type}</p>
                    <p className="text-sm text-ngenius-gray-500">
                      {new Date(appointment.start_time).toLocaleDateString()} at {formatTime(appointment.start_time)}
                    </p>
                    <p className="text-sm text-ngenius-gray-500">
                      {appointment.provider?.raw_user_meta_data?.full_name} - {appointment.patient?.first_name} {appointment.patient?.last_name}
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