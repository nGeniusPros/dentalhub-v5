import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: keyof typeof Icons;
  variant: 'primary' | 'secondary' | 'accent1' | 'accent2';
}

const variantStyles = {
  primary: 'bg-[#1B2B85] text-white',
  secondary: 'bg-[#6B4C9A] text-white',
  accent1: 'bg-[#C5A572] text-white',
  accent2: 'bg-[#4BC5BD] text-white',
};

const StatsCard = ({ title, value, change, icon, variant }: StatsCardProps) => {
  const Icon = Icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={cn('p-3 rounded-lg', variantStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              'text-sm font-medium px-3 py-1 rounded-full',
              change >= 0 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            )}
          >
            {change >= 0 ? '+' : ''}{change}%
          </motion.span>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-gray-900">
          {value}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;