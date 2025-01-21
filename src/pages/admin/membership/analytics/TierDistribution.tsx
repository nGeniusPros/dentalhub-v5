import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const TierDistribution = () => {
  const data = [
    { name: 'Basic Care', value: 450, color: '#4BC5BD' },
    { name: 'Premium Care', value: 350, color: '#6B4C9A' },
    { name: 'Elite Care', value: 150, color: '#C5A572' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Membership Distribution</h2>
          <p className="text-sm text-gray-500">Members by tier level</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="h-[300px]">
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

      <div className="mt-4 space-y-2">
        {data.map((tier, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
              <span className="font-medium">{tier.name}</span>
            </div>
            <span className="text-sm text-gray-500">{tier.value} members</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};