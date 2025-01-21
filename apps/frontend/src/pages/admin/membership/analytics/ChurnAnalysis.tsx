import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const ChurnAnalysis = () => {
  const data = [
    { month: 'Jan', churnRate: 2.1, retentionRate: 97.9, reactivations: 5 },
    { month: 'Feb', churnRate: 1.8, retentionRate: 98.2, reactivations: 7 },
    { month: 'Mar', churnRate: 1.5, retentionRate: 98.5, reactivations: 8 },
    { month: 'Apr', churnRate: 1.9, retentionRate: 98.1, reactivations: 6 },
    { month: 'May', churnRate: 1.6, retentionRate: 98.4, reactivations: 9 },
    { month: 'Jun', churnRate: 1.4, retentionRate: 98.6, reactivations: 11 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Churn Analysis</h2>
          <p className="text-sm text-gray-500">Membership retention metrics</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="retentionRate"
              name="Retention Rate %"
              stroke="#4BC5BD"
              strokeWidth={2}
              dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="churnRate"
              name="Churn Rate %"
              stroke="#C5A572"
              strokeWidth={2}
              dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="reactivations"
              name="Reactivations"
              stroke="#6B4C9A"
              strokeWidth={2}
              dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Average Churn</h3>
          <p className="text-2xl font-bold text-red-600">1.7%</p>
          <p className="text-sm text-gray-500">Monthly average</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Retention Rate</h3>
          <p className="text-2xl font-bold text-green-600">98.3%</p>
          <p className="text-sm text-gray-500">Monthly average</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Reactivations</h3>
          <p className="text-2xl font-bold text-primary">7.7</p>
          <p className="text-sm text-gray-500">Monthly average</p>
        </div>
      </div>
    </motion.div>
  );
};