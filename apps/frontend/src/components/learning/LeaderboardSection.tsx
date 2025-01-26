import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

interface LeaderboardEntry {
  id: string;
  name: string;
  role: string;
  points: number;
  avatar?: string;
  rank: number;
  trend: number;
}

const LeaderboardRow: React.FC<LeaderboardEntry> = ({
  name,
  role,
  points,
  avatar,
  rank,
  trend
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-700';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Icons.Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Icons.Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Icons.Trophy className="w-5 h-5 text-amber-600" />;
      default: return rank;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center font-semibold rounded-full",
          getRankColor(rank)
        )}>
          {getRankIcon(rank)}
        </div>
        <div className="flex items-center gap-2">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Icons.User className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{points.toLocaleString()}</p>
          <p className="text-sm text-gray-500">points</p>
        </div>
        <div className={cn(
          "flex items-center text-sm",
          trend > 0 ? "text-green-600" : "text-red-600"
        )}>
          <Icons.TrendingUp
            className={cn(
              "w-4 h-4 mr-1",
              trend < 0 && "rotate-180"
            )}
          />
          {Math.abs(trend)}
        </div>
      </div>
    </motion.div>
  );
};

export const LeaderboardSection: React.FC = () => {
  // This would typically come from an API or context
  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Lead Dentist',
      points: 2450,
      rank: 1,
      trend: 2
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      role: 'Dentist',
      points: 2100,
      rank: 2,
      trend: -1
    },
    {
      id: '3',
      name: 'Emily Parker',
      role: 'Dental Hygienist',
      points: 1950,
      rank: 3,
      trend: 3
    },
    {
      id: '4',
      name: 'James Wilson',
      role: 'Dental Assistant',
      points: 1800,
      rank: 4,
      trend: 1
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Office Manager',
      points: 1650,
      rank: 5,
      trend: -2
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <Button variant="ghost" size="small">
          View All
        </Button>
      </div>

      <div className="space-y-2">
        {leaderboard.map(entry => (
          <LeaderboardRow key={entry.id} {...entry} />
        ))}
      </div>
    </div>
  );
};
