import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCard } from './BadgeCard';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const BadgeList = () => {
  const badges = [
    {
      id: '1',
      name: 'HIPAA Expert',
      description: 'Complete all HIPAA compliance courses',
      icon: 'Shield',
      color: 'primary',
      progress: 75,
      unlocked: false,
      points: 500
    },
    {
      id: '2',
      name: 'Team Player',
      description: 'Participate in 5 team challenges',
      icon: 'Users',
      color: 'purple',
      unlocked: true,
      unlockedAt: '2024-02-15',
      points: 250
    },
    {
      id: '3',
      name: 'Fast Learner',
      description: 'Complete 10 courses in one month',
      icon: 'Zap',
      color: 'yellow',
      progress: 60,
      unlocked: false,
      points: 750
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Badges</h2>
        <Button variant="outline">
          <Icons.Award className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </motion.div>
  );
};