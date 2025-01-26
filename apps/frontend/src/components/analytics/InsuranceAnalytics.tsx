import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";

interface InsuranceAnalyticsProps {
  data: Array<{
    month: string;
    submitted: number;
    approved: number;
    denied: number;
    pending: number;
  }>;
}

export const InsuranceAnalytics: React.FC<InsuranceAnalyticsProps> = ({
  data,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Insurance Claims</h2>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              dataKey="submitted"
              stroke="#1B2B5B"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="approved"
              stroke="#4BC5BD"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="denied"
              stroke="#C5A572"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
