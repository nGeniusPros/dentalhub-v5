import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../../../components/ui/button";
import * as Icons from "lucide-react";

export const AudienceInsights = () => {
  const ageData = [
    { name: "18-24", value: 15, color: "#4BC5BD" },
    { name: "25-34", value: 35, color: "#6B4C9A" },
    { name: "35-44", value: 25, color: "#C5A572" },
    { name: "45+", value: 25, color: "#1B2B5B" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Audience Insights</h2>
          <p className="text-sm text-gray-500">Demographic breakdown</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ageData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Top Locations
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">New York</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Los Angeles</span>
              <span className="text-sm font-medium">25%</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Gender Split
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Female</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Male</span>
              <span className="text-sm font-medium">35%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
