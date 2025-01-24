import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'appointment' | 'message' | 'payment' | 'note';
  title: string;
  description: string;
  timestamp: string;
  icon: keyof typeof Icons;
  status?: 'completed' | 'pending' | 'cancelled';
}

export const RecentActivitySection: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'New Appointment',
      description: 'Dr. Smith scheduled a check-up with John Doe',
      timestamp: '10 minutes ago',
      icon: 'Calendar',
      status: 'completed'
    },
    {
      id: '2',
      type: 'message',
      title: 'Message Sent',
      description: 'Appointment reminder sent to Sarah Johnson',
      timestamp: '1 hour ago',
      icon: 'MessageSquare'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: '$150 received from Mike Wilson',
      timestamp: '2 hours ago',
      icon: 'DollarSign',
      status: 'completed'
    },
    {
      id: '4',
      type: 'note',
      title: 'Treatment Note',
      description: 'Updated treatment plan for Emily Brown',
      timestamp: '3 hours ago',
      icon: 'FileText'
    }
  ];

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'appointment':
        return 'text-blue-500';
      case 'message':
        return 'text-green-500';
      case 'payment':
        return 'text-purple-500';
      case 'note':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status?: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = Icons[activity.icon];
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={cn(
                  'p-2 rounded-full',
                  'bg-gray-100 dark:bg-gray-800',
                  getIconColor(activity.type)
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                  {activity.status && (
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(activity.status)
                    )}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};