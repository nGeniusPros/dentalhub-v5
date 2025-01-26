import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.user_metadata?.name || "Admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#1B2B85]">Practice Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {name}</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/admin-dashboard/reports")}
          className="text-gray-700 hover:text-gray-900"
        >
          <Icons.FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin-dashboard/ai-consultant")}
          className="text-gray-700 hover:text-gray-900"
        >
          <Icons.Brain className="w-4 h-4 mr-2" />
          AI Insights
        </Button>
        <Button
          className="bg-[#1B2B85] hover:bg-[#1B2B85]/90 text-white"
          onClick={() => navigate("/admin-dashboard/staff")}
        >
          <Icons.UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>
    </motion.div>
  );
};
