import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../../../../components/dashboard/StatsCard";

interface InsuranceMetricsProps {
  metrics: {
    totalClaims: number;
    pendingClaims: number;
    deniedClaims: number;
    averageProcessingDays: number;
    totalAR: number;
    claimAcceptanceRate: number;
  };
}

export const InsuranceMetrics = ({ metrics }: InsuranceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total A/R"
        value={`$${metrics.totalAR.toLocaleString()}`}
        icon="DollarSign"
        variant="primary"
      />
      <StatsCard
        title="Pending Claims"
        value={metrics.pendingClaims.toString()}
        icon="Clock"
        variant="secondary"
      />
      <StatsCard
        title="Claim Acceptance Rate"
        value={`${metrics.claimAcceptanceRate}%`}
        icon="CheckCircle"
        variant="accent1"
      />
    </div>
  );
};
