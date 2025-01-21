import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';

export const VoiceAnalytics = () => {
  const data = [
    { date: 'Mon', completed: 45, failed: 5, answered: 35 },
    { date: 'Tue', completed: 52, failed: 3, answered: 42 },
    { date: 'Wed', completed: 48, failed: 7, answered: 38 },
    { date: 'Thu', completed: 61, failed: 4, answered: 51 },
    { date: 'Fri', completed: 55, failed: 6, answered: 45 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Voice Campaign Analytics</h2>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#4BC5BD" strokeWidth={2} />
            <Line type="monotone" dataKey="failed" stroke="#C5A572" strokeWidth={2} />
            <Line type="monotone" dataKey="answered" stroke="#1B2B5B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};