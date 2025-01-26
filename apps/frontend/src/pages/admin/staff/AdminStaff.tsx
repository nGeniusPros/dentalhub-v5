import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import { StaffDirectory } from "./components/StaffDirectory";
import { PerformanceTab } from "./components/staff/PerformanceTab";
import { ScheduleTab } from "./components/staff/ScheduleTab";
import { PayrollTab } from "./components/staff/PayrollTab";

export const AdminStaff: React.FC = () => {
  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      title: "Total Staff",
      value: "24",
      trend: "+2",
      trendDirection: "up",
      icon: Icons.Users,
    },
    {
      title: "Active Today",
      value: "18",
      trend: "75%",
      trendDirection: "up",
      icon: Icons.UserCheck,
    },
    {
      title: "Avg Performance",
      value: "92%",
      trend: "+5%",
      trendDirection: "up",
      icon: Icons.TrendingUp,
    },
    {
      title: "Training Hours",
      value: "120",
      trend: "+12",
      trendDirection: "up",
      icon: Icons.GraduationCap,
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "directory":
        return <StaffDirectory searchQuery={searchQuery} />;
      case "performance":
        return <PerformanceTab />;
      case "schedule":
        return <ScheduleTab />;
      case "payroll":
        return <PayrollTab />;
      default:
        return <StaffDirectory searchQuery={searchQuery} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Staff Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your dental practice staff
          </p>
        </div>
        <Button>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === "directory" ? "default" : "outline"}
            onClick={() => setActiveTab("directory")}
          >
            <Icons.Users className="h-4 w-4 mr-2" />
            Directory
          </Button>
          <Button
            variant={activeTab === "performance" ? "default" : "outline"}
            onClick={() => setActiveTab("performance")}
          >
            <Icons.TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </Button>
          <Button
            variant={activeTab === "schedule" ? "default" : "outline"}
            onClick={() => setActiveTab("schedule")}
          >
            <Icons.Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button
            variant={activeTab === "payroll" ? "default" : "outline"}
            onClick={() => setActiveTab("payroll")}
          >
            <Icons.DollarSign className="h-4 w-4 mr-2" />
            Payroll
          </Button>
        </div>
        <div className="relative w-full sm:w-64">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {renderTab()}
      </div>
    </motion.div>
  );
};
