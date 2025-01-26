import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BaseChart } from "./BaseChart";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  title,
  height,
  innerRadius = 60,
  outerRadius = 80,
}) => {
  return (
    <BaseChart title={title} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
      </PieChart>
    </BaseChart>
  );
};
