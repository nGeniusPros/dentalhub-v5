import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const ARAgingChart = () => {
  const agingData = [
    { range: "Current", amount: 45000 },
    { range: "1-30", amount: 35000 },
    { range: "31-60", amount: 25000 },
    { range: "61-90", amount: 15000 },
    { range: "90+", amount: 10000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">A/R Aging</h2>
          <p className="text-sm text-gray-500">Outstanding balance by age</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Amount",
              ]}
            />
            <Bar dataKey="amount" fill="#1B2B85" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
