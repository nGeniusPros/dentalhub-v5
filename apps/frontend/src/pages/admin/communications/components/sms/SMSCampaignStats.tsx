import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../../../../../components/dashboard/StatsCard";

export const SMSCampaignStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Messages"
        value="45,678"
        change={12}
        icon="MessageSquare"
        variant="primary"
      />
      <StatsCard
        title="Delivery Rate"
        value="98.5%"
        change={2}
        icon="CheckCircle"
        variant="secondary"
      />
      <StatsCard
        title="Response Rate"
        value="42%"
        change={5}
        icon="MessageCircle"
        variant="accent1"
      />
      <StatsCard
        title="Conversion Rate"
        value="28%"
        change={3}
        icon="TrendingUp"
        variant="accent2"
      />
    </div>
  );
};
