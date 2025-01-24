import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: keyof typeof Icons;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  const Icon = Icons[icon];
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <p className={cn('ml-2 text-sm font-medium', trendColor)}>
                {change}
              </p>
            )}
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export const StatsSection = () => {
  const stats: StatCardProps[] = [
    {
      title: "Today's Patients",
      value: 12,
      change: "+2.5%",
      icon: "Users",
      trend: "up"
    },
    {
      title: "Appointments",
      value: 24,
      change: "+4.1%",
      icon: "Calendar",
      trend: "up"
    },
    {
      title: "Treatments",
      value: 8,
      change: "-0.5%",
      icon: "Activity",
      trend: "down"
    },
    {
      title: "Revenue",
      value: "$2,450",
      change: "+6.3%",
      icon: "DollarSign",
      trend: "up"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </motion.div>
  );
};