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
  primary: 'bg-gradient-ocean text-white',
  secondary: 'bg-gradient-royal text-white',
  accent1: 'bg-gradient-gold text-white',
  accent2: 'bg-gradient-tropical text-white',
};

const StatsCard = ({ title, value, change, icon, variant }: StatsCardProps) => {
  const Icon = Icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-light hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={cn('p-3 rounded-lg shadow-md', variantStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              'text-sm font-medium px-3 py-1 rounded-full',
              change >= 0 
                ? 'bg-green/10 text-green' 
                : 'bg-red-100 text-red-600'
            )}
          >
            {change >= 0 ? '+' : ''}{change}%
          </motion.span>
        )}
      </div>
      
      <h3 className="mt-4 text-2xl font-semibold bg-gradient-corporate text-transparent bg-clip-text">
        {value}
      </h3>
      <p className="text-gray-dark text-sm">{title}</p>
    </motion.div>
  );
};

export default StatsCard;