import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../../components/ui/button";
import * as Icons from "lucide-react";

export const RevenueAnalytics = () => {
  const data = [
    { month: "Jan", revenue: 45000, projectedRevenue: 48000 },
    { month: "Feb", revenue: 48000, projectedRevenue: 51000 },
    { month: "Mar", revenue: 52000, projectedRevenue: 54000 },
    { month: "Apr", revenue: 55000, projectedRevenue: 57000 },
    { month: "May", revenue: 58000, projectedRevenue: 60000 },
    { month: "Jun", revenue: 61000, projectedRevenue: 63000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Revenue Analytics</h2>
          <p className="text-sm text-gray-500">Membership revenue trends</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
              name="Actual Revenue"
              stroke="#4BC5BD"
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="projectedRevenue"
              name="Projected Revenue"
              stroke="#6B4C9A"
              fill="none"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Monthly Revenue
          </h3>
          <p className="text-2xl font-bold text-primary">$61,000</p>
          <p className="text-sm text-green-600">+5.2% vs last month</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Annual Run Rate
          </h3>
          <p className="text-2xl font-bold text-primary">$732,000</p>
          <p className="text-sm text-green-600">+12.5% vs last year</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Avg Revenue/Member
          </h3>
          <p className="text-2xl font-bold text-primary">$49.50</p>
          <p className="text-sm text-green-600">+3.1% vs last month</p>
        </div>
      </div>
    </motion.div>
  );
};
