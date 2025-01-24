import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../../lib/utils';

interface StaffWelcomeProps {
  className?: string;
}

export const StaffWelcome: React.FC<StaffWelcomeProps> = ({ className }) => {
  const currentHour = new Date().getHours();
  let greeting = 'Good Morning';
  
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon';
  } else if (currentHour >= 17) {
    greeting = 'Good Evening';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, Dr. Smith!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Here's what's happening at your practice today
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Today's Appointments
            </div>
            <div className="text-2xl font-bold text-primary">12</div>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icons.Calendar className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
