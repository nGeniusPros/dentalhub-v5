import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export const ScheduleSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [appointments] = React.useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      time: '9:00 AM',
      type: 'Check-up',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      time: '10:30 AM',
      type: 'Cleaning',
      status: 'in-progress'
    },
    {
      id: '3',
      patientName: 'Mike Johnson',
      time: '2:00 PM',
      type: 'Consultation',
      status: 'scheduled'
    }
  ]);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Icons.ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            {selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Button>
          <Button variant="outline" size="sm">
            <Icons.ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className={cn(
                'p-2 rounded-full',
                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                appointment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                appointment.status === 'completed' ? 'bg-green-100 text-green-600' :
                'bg-red-100 text-red-600'
              )}>
                <Icons.Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{appointment.time}</span>
                  <span>•</span>
                  <span>{appointment.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Icons.MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icons.Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icons.MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </div>
    </motion.div>
  );
};
