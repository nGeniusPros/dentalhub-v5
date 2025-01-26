import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../../types/learning';
import { cn } from '../../lib/utils';

interface BadgeCardProps {
  badge: Badge;
  onView: (badgeId: string) => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onView }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBadgeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement': return Icons.Trophy;
      case 'skill': return Icons.Zap;
      case 'completion': return Icons.CheckCircle;
      case 'excellence': return Icons.Star;
      default: return Icons.Award;
    }
  };

  const BadgeIcon = getBadgeIcon(badge.category);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl shadow-sm p-4 text-center",
        badge.unlocked && "border-2 border-green-500"
      )}
    >
      <div className="flex justify-center mb-3">
        <div className={cn(
          "p-3 rounded-lg inline-block",
          badge.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
        )}>
          <BadgeIcon className="w-8 h-8" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1">{badge.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getRarityColor(badge.rarity)
          )}>
            {badge.rarity}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            "bg-indigo-100 text-indigo-600"
          )}>
            {badge.category}
          </span>
        </div>

        {!badge.unlocked && badge.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{badge.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
          </div>
        )}

        {badge.criteria && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Requirements:</p>
            <ul className="space-y-1 text-left">
              {badge.criteria.map((criterion, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  {criterion.completed ? (
                    <Icons.CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  ) : (
                    <Icons.Circle className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="line-clamp-2">{criterion.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant={badge.unlocked ? "outline" : "ghost"}
          className="w-full"
          onClick={() => onView(badge.id)}
        >
          {badge.unlocked ? 'View Details' : 'See Requirements'}
        </Button>
      </div>
    </motion.div>
  );
};

export const BadgeList: React.FC = () => {
  // This would typically come from an API or context
  const badges: Badge[] = [
    {
      id: '1',
      title: 'HIPAA Master',
      description: 'Demonstrated excellence in HIPAA compliance',
      category: 'Excellence',
      rarity: 'Epic',
      unlocked: true,
      criteria: [
        { description: 'Complete HIPAA certification', completed: true },
        { description: 'Score 100% on assessment', completed: true },
        { description: 'Help 5 team members', completed: true }
      ]
    },
    {
      id: '2',
      title: 'Patient Care Expert',
      description: 'Mastery in patient care and satisfaction',
      category: 'Skill',
      rarity: 'Rare',
      unlocked: false,
      progress: 66,
      criteria: [
        { description: 'Complete patient care courses', completed: true },
        { description: 'Receive 10 positive reviews', completed: true },
        { description: 'Handle 3 complex cases', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Team Leader',
      description: 'Outstanding leadership in dental practice',
      category: 'Achievement',
      rarity: 'Legendary',
      unlocked: false,
      progress: 33,
      criteria: [
        { description: 'Complete leadership training', completed: true },
        { description: 'Lead 5 team projects', completed: false },
        { description: 'Mentor 3 team members', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Quick Learner',
      description: 'Completed 5 courses in record time',
      category: 'Completion',
      rarity: 'Common',
      unlocked: true,
      criteria: [
        { description: 'Complete 5 courses', completed: true },
        { description: 'Maintain 90%+ scores', completed: true }
      ]
    }
  ];

  const handleViewBadge = (badgeId: string) => {
    console.log('Viewing badge:', badgeId);
    // Implement view badge logic
  };

  const [filter, setFilter] = React.useState('all');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Badges</h2>
          <p className="text-sm text-gray-600">
            {badges.filter(b => b.unlocked).length} of {badges.length} earned
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="small">
            Share Badges
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Achievement', 'Skill', 'Completion', 'Excellence'].map((category) => (
          <Button
            key={category}
            variant={filter === category.toLowerCase() ? "primary" : "outline"}
            size="small"
            onClick={() => setFilter(category.toLowerCase())}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges
          .filter(badge => filter === 'all' || badge.category.toLowerCase() === filter)
          .map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onView={handleViewBadge}
            />
          ))}
      </div>
    </div>
  );
};
