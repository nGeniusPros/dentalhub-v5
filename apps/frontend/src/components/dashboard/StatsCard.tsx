import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: keyof typeof Icons;
  variant: "primary" | "secondary" | "accent1" | "accent2";
}

const variantStyles = {
  primary: {
    background: "bg-gradient-to-br from-[#1B2B85] to-[#2C3E9E]",
    icon: "bg-white/10",
    text: "text-white",
  },
  secondary: {
    background: "bg-gradient-to-br from-[#6B4C9A] to-[#8B6CB8]",
    icon: "bg-white/10",
    text: "text-white",
  },
  accent1: {
    background: "bg-gradient-to-br from-[#C5A572] to-[#D4BC94]",
    icon: "bg-white/10",
    text: "text-white",
  },
  accent2: {
    background: "bg-gradient-to-br from-[#4BC5BD] to-[#6CD4CC]",
    icon: "bg-white/10",
    text: "text-white",
  },
};

const StatsCard = ({ title, value, change, icon, variant }: StatsCardProps) => {
  const Icon = Icons[icon];
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "rounded-xl p-6 shadow-lg backdrop-blur-sm",
        styles.background,
        styles.text,
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-3 rounded-lg", styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm",
              change >= 0
                ? "bg-green-500/20 text-green-100"
                : "bg-red-500/20 text-red-100",
            )}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </motion.span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm opacity-80 mt-1">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
