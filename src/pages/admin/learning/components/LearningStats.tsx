import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../components/dashboard/StatsCard';

export const LearningStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Points Earned"
        value="1,250"
        change={15}
        icon="Award"
        variant="primary"
      />
      <StatsCard
        title="Courses Completed"
        value="8"
        change={2}
        icon="GraduationCap"
        variant="secondary"
      />
      <StatsCard
        title="Active Challenges"
        value="3"
        change={1}
        icon="Target"
        variant="accent1"
      />
      <StatsCard
        title="Current Rank"
        value="Gold"
        icon="Trophy"
        variant="accent2"
      />
    </div>
  );
};