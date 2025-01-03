import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../../components/dashboard/StatsCard';

export const EmailCampaignStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Sent"
        value="12,345"
        change={8}
        icon="Send"
        variant="primary"
      />
      <StatsCard
        title="Open Rate"
        value="45.8%"
        change={5}
        icon="Eye"
        variant="secondary"
      />
      <StatsCard
        title="Click Rate"
        value="12.3%"
        change={3}
        icon="MousePointer"
        variant="accent1"
      />
      <StatsCard
        title="Conversion Rate"
        value="8.7%"
        change={2}
        icon="TrendingUp"
        variant="accent2"
      />
    </div>
  );
};