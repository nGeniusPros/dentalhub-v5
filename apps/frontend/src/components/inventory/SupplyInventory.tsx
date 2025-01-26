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
import { Button } from "../ui/button";
import * as Icons from "lucide-react";

interface SupplyInventoryProps {
  data: Array<{
    category: string;
    inStock: number;
    reorder: number;
  }>;
}

export const SupplyInventory = ({ data }: SupplyInventoryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Supply Inventory</h2>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(203, 213, 225, 0.3)"
            />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="inStock"
              fill="#4BC5BD"
              radius={[4, 4, 0, 0]}
              name="In Stock"
            />
            <Bar
              dataKey="reorder"
              fill="#C5A572"
              radius={[4, 4, 0, 0]}
              name="Reorder Point"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
