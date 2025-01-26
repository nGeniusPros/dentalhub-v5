import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../../components/ui/button";
import * as Icons from "lucide-react";

export const PointsAnalytics = () => {
  const data = [
    { activity: "Visits", earned: 25000, redeemed: 18000 },
    { activity: "Referrals", earned: 15000, redeemed: 12000 },
    { activity: "Reviews", earned: 8000, redeemed: 6000 },
    { activity: "Treatments", earned: 12000, redeemed: 9000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Points Activity</h2>
          <p className="text-sm text-gray-500">Points earned vs redeemed</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(203, 213, 225, 0.3)"
            />
            <XAxis dataKey="activity" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="earned"
              name="Points Earned"
              fill="#4BC5BD"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="redeemed"
              name="Points Redeemed"
              fill="#6B4C9A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Points Balance
          </h3>
          <p className="text-2xl font-bold text-primary">125,000</p>
          <p className="text-sm text-gray-500">Across all members</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Average Per Member
          </h3>
          <p className="text-2xl font-bold text-primary">2,500</p>
          <p className="text-sm text-gray-500">Points per active member</p>
        </div>
      </div>
    </motion.div>
  );
};
