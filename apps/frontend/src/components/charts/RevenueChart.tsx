import React from "react";
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
import { RevenueAnalytics } from '../../types/dashboard';

interface RevenueChartProps {
  data: RevenueAnalytics;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data.monthlyRevenue.months.map((month, index) => ({
    name: month,
    revenue: data.monthlyRevenue.revenue[index],
    expenses: data.monthlyRevenue.expenses[index],
    profit: data.monthlyRevenue.profit[index],
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-navy via-purple to-turquoise bg-clip-text text-transparent">
        Revenue Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="name"
            className="text-sm"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis
            className="text-sm"
            tick={{ fill: '#6B7280' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [formatCurrency(value)]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#1E40AF"
            strokeWidth={2}
            dot={{ fill: '#1E40AF', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke="#40E0D0"
            strokeWidth={2}
            dot={{ fill: '#40E0D0', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
