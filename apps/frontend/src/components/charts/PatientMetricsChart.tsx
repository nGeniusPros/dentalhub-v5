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
    <div className="h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Patient Growth</h2>
          <p className="text-sm text-gray-500">Monthly patient acquisition metrics</p>
        </div>
      </div>
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
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Bar 
            dataKey="newPatients" 
            name="New Patients"
            fill="#312e81"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="returningPatients" 
            name="Returning Patients"
            fill="#7e22ce"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="referrals" 
            name="Referrals"
            fill="#0d9488"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
