import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../components/dashboard/StatsCard';

export const SocialMediaStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Followers"
        value="12,345"
        change={8}
        icon="Users"
        variant="primary"
      />
      <StatsCard
        title="Engagement Rate"
        value="4.8%"
        change={12}
        icon="Heart"
        variant="secondary"
      />
      <StatsCard
        title="Post Reach"
        value="45.2K"
        change={15}
        icon="Share2"
        variant="accent1"
      />
      <StatsCard
        title="Reviews"
        value="4.9"
        change={3}
        icon="Star"
        variant="accent2"
      />
    </div>
  );
};