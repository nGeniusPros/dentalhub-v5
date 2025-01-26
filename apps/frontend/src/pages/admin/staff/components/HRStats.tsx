import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../../../../components/dashboard/StatsCard";

export const HRStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Staff"
        value="24"
        change={8}
        icon="Users"
        variant="primary"
      />
      <StatsCard
        title="Open Positions"
        value="3"
        change={-1}
        icon="Briefcase"
        variant="secondary"
      />
      <StatsCard
        title="Time Off Requests"
        value="5"
        change={2}
        icon="Calendar"
        variant="accent1"
      />
      <StatsCard
        title="Satisfaction"
        value="92%"
        change={5}
        icon="Heart"
        variant="accent2"
      />
    </div>
  );
};
