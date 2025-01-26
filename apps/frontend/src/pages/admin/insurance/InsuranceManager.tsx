import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InsuranceClaimsTable } from "./components/InsuranceClaimsTable";
import { ClaimStatusChart } from "./components/ClaimStatusChart";
import { ARAgingChart } from "./components/ARAgingChart";
import { InsuranceMetrics } from "./components/InsuranceMetrics";
import { EligibilityVerification } from "./components/EligibilityVerification";
import { useInsuranceData } from "../../../hooks/use-insurance-data";

const InsuranceManager = () => {
  const { claims, metrics, loading, error } = useInsuranceData();

  if (loading) {
    return <div>Loading insurance data...</div>;
  }

  if (error) {
    return <div>Error loading insurance data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Insurance Manager
          </h1>
          <p className="text-gray-500">Manage claims and verify eligibility</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Claims
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Icons.Plus className="w-4 h-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      <InsuranceMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClaimStatusChart data={claims} />
        <ARAgingChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsuranceClaimsTable claims={claims} />
        </div>
        <EligibilityVerification />
      </div>
    </div>
  );
};

export default InsuranceManager;
