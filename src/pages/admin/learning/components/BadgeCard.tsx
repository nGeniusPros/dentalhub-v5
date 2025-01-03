import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: keyof typeof Icons;
    color: string;
    progress?: number;
    unlocked: boolean;
    unlockedAt?: string;
    points: number;
  };
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const Icon = Icons[badge.icon];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-4 rounded-xl border",
        badge.unlocked 
          ? "bg-white border-primary/20" 
          : "bg-gray-50 border-gray-200"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          badge.unlocked ? `bg-${badge.color}/10` : "bg-gray-200"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            badge.unlocked ? `text-${badge.color}` : "text-gray-400"
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{badge.name}</h3>
          <p className="text-sm text-gray-500">{badge.description}</p>
        </div>
      </div>

      {badge.unlocked ? (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Icons.Award className="w-4 h-4 text-yellow-500" />
            <span>{badge.points} points earned</span>
          </div>
          {badge.unlockedAt && (
            <span className="text-gray-500">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      ) : badge.progress !== undefined && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{badge.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${badge.progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};