import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const CompetitorAnalysis = () => {
  const data = [
    { month: 'Jan', you: 2500, competitor1: 2200, competitor2: 1800 },
    { month: 'Feb', you: 2800, competitor1: 2300, competitor2: 1900 },
    { month: 'Mar', you: 3200, competitor1: 2500, competitor2: 2100 },
    { month: 'Apr', you: 3500, competitor1: 2700, competitor2: 2300 },
    { month: 'May', you: 3800, competitor1: 2900, competitor2: 2500 },
    { month: 'Jun', you: 4200, competitor1: 3100, competitor2: 2700 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Competitor Analysis</h2>
          <p className="text-sm text-gray-500">Engagement comparison</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
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
              dataKey="you"
              stroke="#4BC5BD"
              strokeWidth={2}
              dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="competitor1"
              stroke="#6B4C9A"
              strokeWidth={2}
              dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="competitor2"
              stroke="#C5A572"
              strokeWidth={2}
              dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Your Growth</p>
          <p className="text-lg font-semibold text-green-600">+15.2%</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Market Position</p>
          <p className="text-lg font-semibold text-primary">#1</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Engagement Gap</p>
          <p className="text-lg font-semibold text-blue-600">+25%</p>
        </div>
      </div>
    </motion.div>
  );
};