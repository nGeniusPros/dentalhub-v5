import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LeaderboardSection = () => {
  const navigate = useNavigate();
  const leaderboard = [
    { name: 'Dr. Sarah Wilson', points: 1250, rank: 1, trend: 'up' },
    { name: 'Dr. Michael Chen', points: 1150, trend: 'down' },
    { name: 'Emily Parker', points: 1050, trend: 'up' },
    { name: 'Dr. James Smith', points: 950, trend: 'same' },
    { name: 'Lisa Johnson', points: 900, trend: 'up' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin-dashboard/learning/leaderboard')}
        >
          <Icons.Users className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                index === 1 ? 'bg-gray-100 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.points} points</p>
              </div>
            </div>
            {user.trend === 'up' && <Icons.TrendingUp className="w-4 h-4 text-green-500" />}
            {user.trend === 'down' && <Icons.TrendingDown className="w-4 h-4 text-red-500" />}
            {user.trend === 'same' && <Icons.Minus className="w-4 h-4 text-gray-500" />}
          </div>
        ))}
      </div>
    </motion.div>
  );
};