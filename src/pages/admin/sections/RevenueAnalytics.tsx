import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../components/ui/button';

export const RevenueAnalytics = () => {
  const revenueData = [
    { month: 'Jan', revenue: 125000, expenses: 85000, profit: 40000 },
    { month: 'Feb', revenue: 132000, expenses: 88000, profit: 44000 },
    { month: 'Mar', revenue: 141000, expenses: 92000, profit: 49000 },
    { month: 'Apr', revenue: 145000, expenses: 94000, profit: 51000 },
    { month: 'May', revenue: 138000, expenses: 90000, profit: 48000 },
    { month: 'Jun', revenue: 152000, expenses: 95000, profit: 57000 },
  ];

  const revenueByService = [
    { name: 'General Dentistry', value: 45, color: '#4BC5BD' },
    { name: 'Orthodontics', value: 25, color: '#6B4C9A' },
    { name: 'Cosmetic', value: 20, color: '#C5A572' },
    { name: 'Implants', value: 10, color: '#1B2B5B' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
          <p className="text-sm text-gray-500">Financial performance overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4BC5BD"
                strokeWidth={2}
                dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#C5A572"
                strokeWidth={2}
                dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#6B4C9A"
                strokeWidth={2}
                dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Revenue by Service</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueByService}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueByService.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Monthly Comparison</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4BC5BD" name="Revenue" />
              <Bar dataKey="expenses" fill="#C5A572" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};