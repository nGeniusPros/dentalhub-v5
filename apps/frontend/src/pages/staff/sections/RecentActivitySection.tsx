import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { formatTime } from '../../../lib/utils/date';

export const RecentActivitySection = () => {
  const activities = [
    { 
      type: 'appointment',
      message: 'New appointment scheduled',
      patient: 'John Smith',
      time: '09:30',
      icon: 'Calendar'
    },
    {
      type: 'treatment',
      message: 'Treatment plan updated',
      patient: 'Sarah Johnson',
      time: '10:15',
      icon: 'FileText'
    },
    {
      type: 'message',
      message: 'Message sent to patient',
      patient: 'Mike Davis',
      time: '11:00',
      icon: 'MessageSquare'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-lg ${
              activity.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'treatment' ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              {React.createElement(Icons[activity.icon as keyof typeof Icons], {
                className: 'w-5 h-5'
              })}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.message}</p>
              <p className="text-sm text-gray-500">Patient: {activity.patient}</p>
              <p className="text-sm text-gray-500">{formatTime(activity.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};