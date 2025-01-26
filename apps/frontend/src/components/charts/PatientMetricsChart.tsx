import React from "react";
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

interface PatientMetricsChartProps {
  data: {
    name: string;
    newPatients: number;
    returningPatients: number;
    referrals: number;
  }[];
}

export const PatientMetricsChart: React.FC<PatientMetricsChartProps> = ({
  data,
}) => {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Patient Metrics</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="newPatients" fill="#8884d8" />
          <Bar dataKey="returningPatients" fill="#82ca9d" />
          <Bar dataKey="referrals" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
