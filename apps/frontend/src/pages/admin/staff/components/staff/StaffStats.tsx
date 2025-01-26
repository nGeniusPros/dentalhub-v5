import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../../../../../components/dashboard/StatsCard";

export const StaffStats = () => {
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
        title="Active Staff"
        value="22"
        change={5}
        icon="UserCheck"
        variant="secondary"
      />
      <StatsCard
        title="Satisfaction"
        value="92%"
        change={3}
        icon="Heart"
        variant="accent1"
      />
      <StatsCard
        title="Retention Rate"
        value="95%"
        change={2}
        icon="UserPlus"
        variant="accent2"
      />
    </div>
  );
};
