import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../components/dashboard/StatsCard';

export const MembershipStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Members"
        value="1,234"
        change={8}
        icon="Users"
        variant="primary"
      />
      <StatsCard
        title="Monthly Revenue"
        value="$45,678"
        change={12}
        icon="DollarSign"
        variant="secondary"
      />
      <StatsCard
        title="Retention Rate"
        value="94%"
        change={3}
        icon="UserCheck"
        variant="accent1"
      />
      <StatsCard
        title="Points Redeemed"
        value="125K"
        change={15}
        icon="Award"
        variant="accent2"
      />
    </div>
  );
};