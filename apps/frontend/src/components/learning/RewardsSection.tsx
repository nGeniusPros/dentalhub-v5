import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Reward } from '../../types/learning';
import { cn } from '../../lib/utils';

interface RewardCardProps {
  reward: Reward;
  onClaim: (rewardId: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaim }) => {
  const isAvailable = reward.pointsRequired <= reward.userPoints;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl shadow-sm p-4",
        isAvailable && "border-2 border-green-500"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          isAvailable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        )}>
          <Icons.Gift className="w-5 h-5" />
        </div>
        <div className="flex items-center text-sm font-medium">
          <Icons.Star className="w-4 h-4 mr-1 text-yellow-500" />
          <span className={isAvailable ? "text-green-600" : "text-gray-600"}>
            {reward.pointsRequired} points
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1">{reward.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

      <div className="space-y-4">
        {reward.expiryDate && (
          <div className="flex items-center text-sm text-orange-600">
            <Icons.Clock className="w-4 h-4 mr-1" />
            Expires in {Math.ceil((new Date(reward.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
          </div>
        )}

        {reward.category && (
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              {
                'bg-purple-100 text-purple-600': reward.category === 'Premium',
                'bg-blue-100 text-blue-600': reward.category === 'Professional',
                'bg-green-100 text-green-600': reward.category === 'Achievement'
              }
            )}>
              {reward.category}
            </span>
          </div>
        )}

        <Button
          variant={isAvailable ? "primary" : "outline"}
          className="w-full"
          disabled={!isAvailable}
          onClick={() => onClaim(reward.id)}
        >
          {isAvailable ? 'Claim Reward' : `${reward.pointsRequired - reward.userPoints} more points needed`}
        </Button>
      </div>
    </motion.div>
  );
};

export const RewardsSection: React.FC = () => {
  // This would typically come from an API or context
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Premium Course Access',
      description: 'Get access to all premium courses for 3 months',
      pointsRequired: 1000,
      userPoints: 1200,
      category: 'Premium',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Conference Ticket',
      description: 'Free ticket to the Annual Dental Conference',
      pointsRequired: 2000,
      userPoints: 1200,
      category: 'Professional',
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Expert Mentoring Session',
      description: '1-hour mentoring session with a dental expert',
      pointsRequired: 800,
      userPoints: 1200,
      category: 'Achievement'
    }
  ];

  const handleClaimReward = (rewardId: string) => {
    console.log('Claiming reward:', rewardId);
    // Implement claim reward logic
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Rewards</h2>
          <p className="text-sm text-gray-600">
            You have {rewards[0].userPoints} points to spend
          </p>
        </div>
        <Button variant="ghost">
          <Icons.History className="w-4 h-4 mr-2" />
          History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map(reward => (
          <RewardCard
            key={reward.id}
            reward={reward}
            onClaim={handleClaimReward}
          />
        ))}
      </div>
    </div>
  );
};
