import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';

interface QuickAction {
  icon: keyof typeof Icons;
  label: string;
  color: string;
  onClick?: () => void;
}

export const QuickActionsSection = () => {
  const actions: QuickAction[] = [
    { icon: 'Calendar', label: 'Schedule Appointment', color: 'bg-blue-500' },
    { icon: 'MessageSquare', label: 'Send Message', color: 'bg-green-500' },
    { icon: 'FileText', label: 'Create Treatment Plan', color: 'bg-purple-500' },
    { icon: 'Phone', label: 'Call Patient', color: 'bg-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = Icons[action.icon];
          return (
            <Button
              key={action.label}
              variant="outline"
              className={cn(
                'flex items-center justify-start space-x-2 p-4 w-full',
                'hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
              onClick={action.onClick}
            >
              <Icon className={cn('h-5 w-5', action.color)} />
              <span>{action.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};