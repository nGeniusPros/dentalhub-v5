import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../components/dashboard/StatsCard';

export const KPIOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Monthly Revenue"
        value="$145,678"
        change={8}
        icon="DollarSign"
        variant="primary"
      />
      <StatsCard
        title="Patient Growth"
        value="3,456"
        change={12}
        icon="Users"
        variant="secondary"
      />
      <StatsCard
        title="Treatment Acceptance"
        value="78%"
        change={5}
        icon="CheckCircle"
        variant="accent1"
      />
      <StatsCard
        title="Appointment Fill Rate"
        value="92%"
        change={3}
        icon="Calendar"
        variant="accent2"
      />
      <StatsCard
        title="Insurance Claims"
        value="245"
        change={7}
        icon="FileCheck"
        variant="primary"
      />
      <StatsCard
        title="Average Wait Time"
        value="12min"
        change={-4}
        icon="Clock"
        variant="secondary"
      />
      <StatsCard
        title="Patient Satisfaction"
        value="4.8"
        change={2}
        icon="Star"
        variant="accent1"
      />
      <StatsCard
        title="Staff Productivity"
        value="94%"
        change={6}
        icon="TrendingUp"
        variant="accent2"
      />
    </div>
  );
};