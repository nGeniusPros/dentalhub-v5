import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const MarketingMetrics = () => {
  const channels = [
    { name: 'Patient Referrals', leads: 85, conversion: 65, cost: 25 },
    { name: 'Google Ads', leads: 120, conversion: 45, cost: 1200 },
    { name: 'Social Media', leads: 95, conversion: 38, cost: 800 },
    { name: 'Email Campaigns', leads: 65, conversion: 52, cost: 400 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Marketing Performance</h2>
          <p className="text-sm text-gray-500">Channel effectiveness and ROI</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.TrendingUp className="w-4 h-4 mr-2" />
          View Trends
        </Button>
      </div>

      <div className="space-y-4">
        {channels.map((channel, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{channel.name}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">New Leads</p>
                <p className="font-medium text-gray-900">{channel.leads}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion</p>
                <p className="font-medium text-gray-900">{channel.conversion}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost/Lead</p>
                <p className="font-medium text-gray-900">${channel.cost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Overall ROI</h3>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Monthly Marketing ROI</p>
            <p className="text-xl font-semibold text-green-600">385%</p>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <Icons.TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12% vs last month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};