import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const EngagementMetrics = () => {
  const data = [
    { date: 'Mon', likes: 245, comments: 45, shares: 22 },
    { date: 'Tue', likes: 312, comments: 62, shares: 28 },
    { date: 'Wed', likes: 286, comments: 51, shares: 25 },
    { date: 'Thu', likes: 402, comments: 78, shares: 35 },
    { date: 'Fri', likes: 375, comments: 68, shares: 30 },
    { date: 'Sat', likes: 265, comments: 42, shares: 18 },
    { date: 'Sun', likes: 228, comments: 35, shares: 15 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Engagement Overview</h2>
          <p className="text-sm text-gray-500">Weekly engagement metrics</p>
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
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#4BC5BD"
              strokeWidth={2}
              dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#6B4C9A"
              strokeWidth={2}
              dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="shares"
              stroke="#C5A572"
              strokeWidth={2}
              dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};