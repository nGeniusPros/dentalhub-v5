import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
} from "recharts";
import { cn } from "../../../../../lib/utils";
import { formatCurrency } from "../../../../../lib/utils/currency";
import { GenerateReportDialog } from "../../../../../components/reports/GenerateReportDialog";

export const PayrollTab = () => {
  const [showReport, setShowReport] = useState(false);

  // Financial Metrics
  const revenueData = [
    { month: "Jan", revenue: 125000, expenses: 85000, profit: 40000 },
    { month: "Feb", revenue: 132000, expenses: 88000, profit: 44000 },
    { month: "Mar", revenue: 141000, expenses: 92000, profit: 49000 },
    { month: "Apr", revenue: 145000, expenses: 94000, profit: 51000 },
    { month: "May", revenue: 138000, expenses: 90000, profit: 48000 },
    { month: "Jun", revenue: 152000, expenses: 95000, profit: 57000 },
  ];

  // Patient Metrics
  const patientData = [
    { month: "Jan", newPatients: 45, activePatients: 1200, retentionRate: 95 },
    { month: "Feb", newPatients: 52, activePatients: 1250, retentionRate: 94 },
    { month: "Mar", newPatients: 48, activePatients: 1290, retentionRate: 96 },
    { month: "Apr", newPatients: 61, activePatients: 1340, retentionRate: 95 },
    { month: "May", newPatients: 55, activePatients: 1380, retentionRate: 93 },
    { month: "Jun", newPatients: 67, activePatients: 1430, retentionRate: 97 },
  ];

  // Treatment Distribution
  const treatmentData = [
    { name: "General Dentistry", value: 45, color: "#4BC5BD" },
    { name: "Orthodontics", value: 25, color: "#6B4C9A" },
    { name: "Cosmetic", value: 20, color: "#C5A572" },
    { name: "Implants", value: 10, color: "#1B2B5B" },
  ];

  // Staff Performance
  const staffPerformance = [
    { name: "Dr. Sarah", patients: 58, production: 12500, efficiency: 95 },
    { name: "Dr. Michael", patients: 52, production: 11800, efficiency: 92 },
    { name: "Dr. Emily", patients: 62, production: 13200, efficiency: 97 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Practice Analytics
          </h2>
          <p className="text-gray-500">
            Comprehensive practice performance insights
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReport(true)}>
            <Icons.FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Monthly Revenue",
            value: formatCurrency(152000),
            change: "+8%",
            icon: "DollarSign",
          },
          {
            label: "Active Patients",
            value: "1,430",
            change: "+12%",
            icon: "Users",
          },
          {
            label: "Treatment Acceptance",
            value: "78%",
            change: "+5%",
            icon: "CheckCircle",
          },
          {
            label: "Patient Satisfaction",
            value: "4.9",
            change: "+0.2",
            icon: "Star",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              {React.createElement(Icons[stat.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary",
              })}
              <span className="text-sm text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4BC5BD" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4BC5BD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(203, 213, 225, 0.3)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4BC5BD"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#6B4C9A"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Treatment Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {treatmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Patient Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Patient Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(203, 213, 225, 0.3)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="#4BC5BD"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="retentionRate"
                  stroke="#6B4C9A"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(203, 213, 225, 0.3)"
                />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#4BC5BD" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B4C9A" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="patients"
                  fill="#4BC5BD"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="efficiency"
                  fill="#6B4C9A"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Insurance Claims</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Submitted</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium">32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <span className="font-medium">198</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Denied</span>
              <span className="font-medium">15</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Appointment Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fill Rate</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">No-Shows</span>
              <span className="font-medium">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancellations</span>
              <span className="font-medium">4.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rescheduled</span>
              <span className="font-medium">8.5%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Marketing ROI</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Social Media</span>
              <span className="font-medium">385%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Campaigns</span>
              <span className="font-medium">425%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referral Program</span>
              <span className="font-medium">520%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Local Advertising</span>
              <span className="font-medium">290%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Generation Dialog */}
      <GenerateReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        data={{
          revenueData,
          patientData,
          treatmentData,
          staffPerformance,
        }}
      />
    </div>
  );
};
