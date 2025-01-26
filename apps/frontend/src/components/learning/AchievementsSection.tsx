import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Achievement } from '../../types/learning';
import { cn } from '../../lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl shadow-sm p-4",
        achievement.unlocked && "border-2 border-green-500"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          achievement.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        )}>
          <Icons.Award className="w-5 h-5" />
        </div>
        {achievement.unlocked && (
          <div className="flex items-center text-sm text-green-600 font-medium">
            <Icons.CheckCircle className="w-4 h-4 mr-1" />
            Unlocked
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{achievement.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                getProgressColor(achievement.progress)
              )}
              style={{ width: `${achievement.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Icons.Star className="w-4 h-4" />
            {achievement.points} points
          </div>
          {achievement.rarity && (
            <div className="flex items-center gap-2 text-purple-600">
              <Icons.Gem className="w-4 h-4" />
              {achievement.rarity}
            </div>
          )}
        </div>

        {achievement.criteria && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Requirements:</p>
            <ul className="space-y-1">
              {achievement.criteria.map((criterion, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  {criterion.completed ? (
                    <Icons.CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Icons.Circle className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  {criterion.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const AchievementsSection: React.FC = () => {
  // This would typically come from an API or context
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Learning Pioneer',
      description: 'Complete your first 5 courses with excellence.',
      points: 500,
      progress: 100,
      unlocked: true,
      rarity: 'Common',
      criteria: [
        { description: 'Complete 5 courses', completed: true },
        { description: 'Achieve 90%+ in assessments', completed: true },
        { description: 'Earn course badges', completed: true }
      ]
    },
    {
      id: '2',
      title: 'Patient Care Expert',
      description: 'Master all patient care modules and receive perfect feedback.',
      points: 1000,
      progress: 60,
      unlocked: false,
      rarity: 'Rare',
      criteria: [
        { description: 'Complete Patient Care track', completed: true },
        { description: 'Perfect assessment scores', completed: false },
        { description: 'Receive 10 positive reviews', completed: true }
      ]
    },
    {
      id: '3',
      title: 'Team Leader',
      description: 'Guide your team to success through learning initiatives.',
      points: 1500,
      progress: 30,
      unlocked: false,
      rarity: 'Epic',
      criteria: [
        { description: 'Lead 3 team challenges', completed: true },
        { description: 'Help 5 team members', completed: false },
        { description: 'Create learning content', completed: false }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Achievements</h2>
          <p className="text-sm text-gray-600">
            {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
          </p>
        </div>
        <Button variant="ghost">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
};
