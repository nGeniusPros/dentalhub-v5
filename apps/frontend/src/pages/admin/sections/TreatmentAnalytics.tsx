import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const TreatmentAnalytics = () => {
  const treatments = [
    { name: 'Cleanings', count: 245, revenue: 61250, growth: '+8%' },
    { name: 'Fillings', count: 180, revenue: 72000, growth: '+5%' },
    { name: 'Root Canals', count: 45, revenue: 67500, growth: '+3%' },
    { name: 'Crowns', count: 65, revenue: 130000, growth: '+12%' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Treatment Analytics</h2>
          <p className="text-sm text-gray-500">Treatment performance and revenue</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.FileText className="w-4 h-4 mr-2" />
          View Report
        </Button>
      </div>

      <div className="space-y-4">
        {treatments.map((treatment, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{treatment.name}</h3>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Icons.TrendingUp className="w-4 h-4" />
                {treatment.growth}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Procedures</p>
                <p className="font-medium text-gray-900">{treatment.count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-medium text-gray-900">${treatment.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Treatment Success Rate</h3>
        <div className="h-2 bg-gray-100 rounded-full">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">Overall Success Rate</span>
          <span className="text-sm font-medium text-gray-900">94%</span>
        </div>
      </div>
    </motion.div>
  );
};