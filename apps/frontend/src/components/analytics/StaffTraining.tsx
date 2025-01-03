import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';

interface StaffTrainingProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const StaffTraining = ({ data }: StaffTrainingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Training Progress</h2>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};