import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: keyof typeof Icons;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export const QuickActionsSection: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      label: 'Add Patient',
      icon: 'UserPlus',
      onClick: () => console.log('Add Patient clicked'),
      variant: 'default'
    },
    {
      label: 'Schedule Appointment',
      icon: 'Calendar',
      onClick: () => console.log('Schedule Appointment clicked'),
      variant: 'outline'
    },
    {
      label: 'Send Message',
      icon: 'MessageSquare',
      onClick: () => console.log('Send Message clicked'),
      variant: 'outline'
    },
    {
      label: 'Create Invoice',
      icon: 'FileText',
      onClick: () => console.log('Create Invoice clicked'),
      variant: 'outline'
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = Icons[action.icon];
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={action.variant}
                  className="w-full justify-start"
                  onClick={action.onClick}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};