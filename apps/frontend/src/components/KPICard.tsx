import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden group"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-purple/5 to-turquoise/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise bg-clip-text text-transparent">
            {value}
          </span>
          
          <div className={`flex items-center gap-1 ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {change >= 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-navy group-hover:via-purple group-hover:to-turquoise rounded-xl transition-colors duration-300" />
      </div>
    </motion.div>
  );
};
