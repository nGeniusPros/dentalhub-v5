import React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "../../../lib/utils";

interface BaseChartProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  height?: number;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  children,
  title,
  className,
  height = 300,
}) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-lg", className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
