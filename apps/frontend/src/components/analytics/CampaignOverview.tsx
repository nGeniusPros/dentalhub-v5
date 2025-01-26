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
import { Button } from "../ui/button";
import * as Icons from "lucide-react";

interface CampaignOverviewProps {
  data: {
    email: { sent: number; opened: number; clicked: number };
    sms: { sent: number; delivered: number; responded: number };
    voice: { attempted: number; connected: number; successful: number };
  };
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({ data }) => {
  const pieData = [
    { name: "Email", value: data.email.sent, color: "#4BC5BD" },
    { name: "SMS", value: data.sms.sent, color: "#6B4C9A" },
    { name: "Voice", value: data.voice.attempted, color: "#C5A572" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Campaign Overview</h2>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
