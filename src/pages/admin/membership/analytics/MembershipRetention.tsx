import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const MembershipRetention = () => {
  const data = [
    { month: 'Jan', retention: 95, renewal: 92, satisfaction: 98 },
    { month: 'Feb', retention: 96, renewal: 94, satisfaction: 97 },
    { month: 'Mar', retention: 94, renewal: 91, satisfaction: 96 },
    { month: 'Apr', retention: 97, renewal: 95, satisfaction: 98 },
    { month: 'May', retention: 98, renewal: 96, satisfaction: 99 },
    { month: 'Jun', retention: 97, renewal: 95, satisfaction: 98 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Member Retention</h2>
          <p className="text-sm text-gray-500">Retention and satisfaction metrics</p>
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
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="retention"
              name="Retention %"
              stroke="#4BC5BD"
              strokeWidth={2}
              dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="renewal"
              name="Renewal %"
              stroke="#6B4C9A"
              strokeWidth={2}
              dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              name="Satisfaction %"
              stroke="#C5A572"
              strokeWidth={2}
              dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Avg Retention</h3>
          <p className="text-2xl font-bold text-green-600">96.2%</p>
          <p className="text-sm text-gray-500">Last 6 months</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Renewal Rate</h3>
          <p className="text-2xl font-bold text-primary">93.8%</p>
          <p className="text-sm text-gray-500">Annual average</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Satisfaction</h3>
          <p className="text-2xl font-bold text-yellow-600">97.7%</p>
          <p className="text-sm text-gray-500">Member satisfaction</p>
        </div>
      </div>
    </motion.div>
  );
};