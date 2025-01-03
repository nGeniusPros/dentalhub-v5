import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { cn } from '../../../../lib/utils';

export const RewardsSection = () => {
  const { dispatch: notifyDispatch } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Rewards' },
    { id: 'time-off', name: 'Time Off' },
    { id: 'gift-cards', name: 'Gift Cards' },
    { id: 'experiences', name: 'Experiences' },
    { id: 'merchandise', name: 'Merchandise' }
  ];

  const rewards = [
    {
      id: '1',
      name: 'Extra Day Off',
      description: 'Earn a bonus vacation day',
      points: 5000,
      category: 'time-off',
      icon: 'Calendar',
      available: true,
      featured: true,
      expiresAt: '2024-12-31',
      claimLimit: 1,
      claimed: 0
    },
    {
      id: '2',
      name: 'Amazon Gift Card',
      description: '$50 Amazon gift card',
      points: 2500,
      category: 'gift-cards',
      icon: 'Gift',
      available: true,
      featured: false,
      claimLimit: 2,
      claimed: 1
    },
    {
      id: '3',
      name: 'Team Lunch',
      description: 'Free lunch for your team',
      points: 1500,
      category: 'experiences',
      icon: 'Utensils',
      available: true,
      featured: false,
      claimLimit: 3,
      claimed: 0
    },
    {
      id: '4',
      name: 'Premium Headphones',
      description: 'High-quality noise-canceling headphones',
      points: 7500,
      category: 'merchandise',
      icon: 'Headphones',
      available: true,
      featured: true,
      claimLimit: 1,
      claimed: 0
    }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeemReward = (reward: any) => {
    // In production, this would make an API call
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Reward Redeemed',
        message: `You have successfully redeemed ${reward.name}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy via-purple to-turquoise text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">1,250 Points</h2>
            <p className="text-white/80">Available to redeem</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">15</p>
              <p className="text-white/80">Rewards Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">Gold</p>
              <p className="text-white/80">Current Tier</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Featured Rewards */}
      {selectedCategory === 'all' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Featured Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.filter(r => r.featured).map(reward => (
              <motion.div
                key={reward.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-navy/5 via-purple/5 to-turquoise/5 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {React.createElement(Icons[reward.icon as keyof typeof Icons], {
                      className: "w-8 h-8 text-primary"
                    })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{reward.name}</h4>
                    <p className="text-gray-500">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">{reward.points} points</span>
                  </div>
                  <Button onClick={() => handleRedeemReward(reward)}>
                    Redeem Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "bg-white rounded-xl p-6 border",
              reward.featured ? "border-primary/20" : "border-gray-200"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                reward.featured ? "bg-primary/10" : "bg-gray-100"
              )}>
                {React.createElement(Icons[reward.icon as keyof typeof Icons], {
                  className: cn(
                    "w-5 h-5",
                    reward.featured ? "text-primary" : "text-gray-600"
                  )
                })}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{reward.name}</h3>
                <p className="text-sm text-gray-500">{reward.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icons.Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{reward.points} points</span>
                </div>
                {reward.claimLimit > 1 && (
                  <span className="text-gray-500">
                    {reward.claimed}/{reward.claimLimit} claimed
                  </span>
                )}
              </div>

              {reward.expiresAt && (
                <p className="text-sm text-gray-500">
                  Expires {new Date(reward.expiresAt).toLocaleDateString()}
                </p>
              )}

              <Button 
                className="w-full"
                onClick={() => handleRedeemReward(reward)}
                disabled={!reward.available}
              >
                {reward.available ? 'Redeem' : 'Coming Soon'}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};