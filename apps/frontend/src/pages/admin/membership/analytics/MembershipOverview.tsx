import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { MembershipStats } from "./MembershipStats";
import { MembershipTrends } from "./MembershipTrends";
import { MembershipRetention } from "./MembershipRetention";
import { RevenueAnalytics } from "./RevenueAnalytics";
import { TierDistribution } from "./TierDistribution";
import { PointsAnalytics } from "./PointsAnalytics";
import { BenefitUsage } from "./BenefitUsage";
import { ChurnAnalysis } from "./ChurnAnalysis";
import { CreateCampaignModal } from "../components/CreateCampaignModal";

const MembershipOverview = () => {
  const [showCreateCampaign, setShowCreateCampaign] = React.useState(false);

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      // Headers
      [
        "Date",
        "Total Members",
        "Revenue",
        "Retention Rate",
        "Points Redeemed",
      ].join(","),
      // Sample data rows
      ["2024-03-01", "1234", "$45678", "94%", "125000"].join(","),
      ["2024-02-01", "1198", "$43456", "93%", "118000"].join(","),
      ["2024-01-01", "1156", "$41234", "92%", "112000"].join(","),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `membership-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSaveCampaign = (campaign: any) => {
    // Here you would typically save the campaign to your backend
    console.log("New campaign:", campaign);
    setShowCreateCampaign(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Membership Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive membership program insights
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            className="bg-gradient-to-r from-navy to-purple text-white"
            onClick={() => setShowCreateCampaign(true)}
          >
            <Icons.Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <MembershipStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembershipTrends />
        <TierDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <MembershipRetention />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PointsAnalytics />
        <BenefitUsage />
      </div>

      <ChurnAnalysis />

      <CreateCampaignModal
        isOpen={showCreateCampaign}
        onClose={() => setShowCreateCampaign(false)}
        onSave={handleSaveCampaign}
      />
    </div>
  );
};

export default MembershipOverview;
