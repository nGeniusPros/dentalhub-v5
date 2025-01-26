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

export const BenefitUsage = () => {
  const data = [
    { benefit: "Free Cleanings", usage: 85, value: 12500 },
    { benefit: "Whitening", usage: 65, value: 9800 },
    { benefit: "Emergency Exams", usage: 45, value: 6700 },
    { benefit: "X-Rays", usage: 75, value: 11200 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Benefit Utilization</h2>
          <p className="text-sm text-gray-500">Usage of membership benefits</p>
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
            <XAxis dataKey="benefit" />
            <YAxis yAxisId="left" orientation="left" stroke="#4BC5BD" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B4C9A" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="usage"
              name="Usage %"
              fill="#4BC5BD"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="value"
              name="Value ($)"
              fill="#6B4C9A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Most Popular Benefits
            </h3>
            <span className="text-sm text-primary">View Details</span>
          </div>
          <div className="space-y-2">
            {data
              .sort((a, b) => b.usage - a.usage)
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.benefit}</span>
                  <span className="text-sm font-medium">
                    {item.usage}% utilization
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
