import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../components/ui/button';

const Analytics = () => {
  // Mock data - would come from PMS API
  const data = [
    { month: 'Jan', revenue: 52000, patients: 145, treatments: 289 },
    { month: 'Feb', revenue: 48000, patients: 132, treatments: 254 },
    { month: 'Mar', revenue: 61000, patients: 156, treatments: 321 },
    { month: 'Apr', revenue: 55000, patients: 142, treatments: 298 },
    { month: 'May', revenue: 59000, patients: 151, treatments: 312 },
    { month: 'Jun', revenue: 63000, patients: 160, treatments: 334 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Analytics</h1>
          <p className="text-gray-500">Track key performance indicators and trends</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B2B85" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1B2B85" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1B2B85"
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Patient Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Patient Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#40E0D0"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Treatment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4">Treatment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Treatments', value: '1,808', icon: 'Stethoscope', change: '+12%' },
            { label: 'Completion Rate', value: '94%', icon: 'CheckCircle', change: '+3%' },
            { label: 'Avg. Treatment Value', value: '$850', icon: 'DollarSign', change: '+5%' },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                {React.createElement(Icons[stat.icon as keyof typeof Icons], {
                  className: "w-5 h-5 text-primary"
                })}
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;