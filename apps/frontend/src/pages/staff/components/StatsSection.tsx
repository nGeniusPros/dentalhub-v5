import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  change: number;
  trend: "up" | "down" | "neutral";
}

export const StatsSection: React.FC = () => {
  const stats: StatItem[] = [
    {
      label: "Total Patients",
      value: "2,847",
      icon: "Users",
      change: 12.5,
      trend: "up",
    },
    {
      label: "Appointments Today",
      value: 24,
      icon: "Calendar",
      change: -2.3,
      trend: "down",
    },
    {
      label: "Revenue (MTD)",
      value: "$48,574",
      icon: "DollarSign",
      change: 8.7,
      trend: "up",
    },
    {
      label: "Patient Satisfaction",
      value: "94%",
      icon: "Heart",
      change: 1.2,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = Icons[stat.icon];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center text-sm",
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600",
                    )}
                  >
                    {stat.trend === "up" && (
                      <Icons.TrendingUp className="h-4 w-4 mr-1" />
                    )}
                    {stat.trend === "down" && (
                      <Icons.TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}%
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
