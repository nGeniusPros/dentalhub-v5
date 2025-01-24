import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { supabase } from '../../../../lib/supabase/client';

interface Activity {
  id: string;
  type: 'appointment' | 'message' | 'treatment' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled';
  icon: keyof typeof Icons;
  color: string;
}

const ActivityItem: React.FC<Activity> = ({ type, title, description, timestamp, status, icon, color }) => {
  const Icon = Icons[icon];
  
  return (
    <div className="flex space-x-4 py-4">
      <div className={cn('p-2 rounded-full', color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        {status && (
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          )}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export const RecentActivitySection = () => {
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'New Appointment',
      description: 'Dr. Smith scheduled a checkup with John Doe',
      timestamp: '2 hours ago',
      status: 'pending',
      icon: 'Calendar',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'message',
      title: 'Message Sent',
      description: 'Reminder sent to Sarah Johnson about her upcoming appointment',
      timestamp: '3 hours ago',
      icon: 'MessageSquare',
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'treatment',
      title: 'Treatment Completed',
      description: 'Root canal procedure completed for Mike Wilson',
      timestamp: '5 hours ago',
      status: 'completed',
      icon: 'CheckCircle',
      color: 'bg-purple-500'
    }
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <button className="text-primary hover:text-primary/80">
          View all
        </button>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} {...activity} />
        ))}
      </div>
    </motion.div>
  );
};