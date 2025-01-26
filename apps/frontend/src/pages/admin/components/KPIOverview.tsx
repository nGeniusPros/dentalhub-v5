import React from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/dashboard/StatsCard";

interface KPIOverviewProps {
  timeRange: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const KPIOverview: React.FC<KPIOverviewProps> = ({ timeRange }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatsCard
        title="Monthly Revenue"
        value="$145,678"
        change={8}
        icon="DollarSign"
        variant="primary"
      />
      <StatsCard
        title="Active Patients"
        value="3,456"
        change={12}
        icon="Users"
        variant="secondary"
      />
      <StatsCard
        title="Treatment Success"
        value="78%"
        change={5}
        icon="CheckCircle"
        variant="accent1"
      />
      <StatsCard
        title="Appointment Rate"
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
        title="Staff Performance"
        value="94%"
        change={6}
        icon="TrendingUp"
        variant="accent2"
      />
    </motion.div>
  );
};
