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
import { Button } from "../../../../components/ui/button";
import * as Icons from "lucide-react";

export const MembershipTrends = () => {
  const data = [
    { month: "Jan", activeMemberships: 980, newSignups: 45, upgrades: 12 },
    { month: "Feb", activeMemberships: 1050, newSignups: 52, upgrades: 15 },
    { month: "Mar", activeMemberships: 1150, newSignups: 48, upgrades: 18 },
    { month: "Apr", activeMemberships: 1234, newSignups: 61, upgrades: 22 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Membership Growth</h2>
          <p className="text-sm text-gray-500">Monthly membership trends</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="h-[300px]">
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
              dataKey="activeMemberships"
              name="Active Members"
              stroke="#4BC5BD"
              strokeWidth={2}
              dot={{ fill: "#4BC5BD", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="newSignups"
              name="New Signups"
              stroke="#6B4C9A"
              strokeWidth={2}
              dot={{ fill: "#6B4C9A", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="upgrades"
              name="Upgrades"
              stroke="#C5A572"
              strokeWidth={2}
              dot={{ fill: "#C5A572", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
