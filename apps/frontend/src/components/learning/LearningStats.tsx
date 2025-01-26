import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: keyof typeof Icons;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color }) => {
  const Icon = Icons[icon];
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-2 rounded-lg",
          `bg-${color}-100 text-${color}-600`
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <Icons.TrendingUp className={cn(
              "w-4 h-4 mr-1",
              !trend.isPositive && "rotate-180"
            )} />
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-semibold">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  );
};

export const LearningStats: React.FC = () => {
  const stats = [
    {
      title: "Courses Completed",
      value: 12,
      trend: { value: 8, isPositive: true },
      icon: "GraduationCap",
      color: "blue"
    },
    {
      title: "Badges Earned",
      value: 24,
      trend: { value: 12, isPositive: true },
      icon: "Shield",
      color: "purple"
    },
    {
      title: "Learning Hours",
      value: "48h",
      trend: { value: 15, isPositive: true },
      icon: "Clock",
      color: "green"
    },
    {
      title: "Points Earned",
      value: "2,450",
      trend: { value: 10, isPositive: true },
      icon: "Star",
      color: "yellow"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
