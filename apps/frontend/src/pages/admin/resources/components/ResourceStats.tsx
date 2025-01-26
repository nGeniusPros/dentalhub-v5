import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export const ResourceStats = () => {
  const stats = [
    { label: "Total Resources", value: "245", icon: "Files", change: "+12" },
    { label: "Downloads Today", value: "45", icon: "Download", change: "+8" },
    { label: "Active Users", value: "89", icon: "Users", change: "+15" },
    {
      label: "Required Forms",
      value: "12",
      icon: "ClipboardCheck",
      change: "0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {React.createElement(Icons[stat.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary",
              })}
            </div>
            <span
              className={`text-sm font-medium ${
                parseInt(stat.change) > 0
                  ? "text-green-600"
                  : parseInt(stat.change) < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {stat.change > "0" && "+"}
              {stat.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
