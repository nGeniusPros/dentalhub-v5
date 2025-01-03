import React from 'react';
import StatsCard from '../../../components/dashboard/StatsCard';

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Today's Patients"
        value="12"
        icon="Users"
        variant="primary"
      />
      <StatsCard
        title="Completed"
        value="5"
        icon="CheckCircle"
        variant="secondary"
      />
      <StatsCard
        title="Pending"
        value="4"
        icon="Clock"
        variant="accent1"
      />
      <StatsCard
        title="Cancelled"
        value="1"
        icon="XCircle"
        variant="accent2"
      />
    </div>
  );
};