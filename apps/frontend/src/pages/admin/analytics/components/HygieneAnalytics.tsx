import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../components/ui/button';

export const HygieneAnalytics = () => {
  const hygieneData = [
    { month: 'Jan', cleanings: 145, recare: 98, newPatients: 45 },
    { month: 'Feb', cleanings: 132, recare: 92, newPatients: 52 },
    { month: 'Mar', cleanings: 158, recare: 105, newPatients: 48 },
    { month: 'Apr', cleanings: 162, recare: 112, newPatients: 61 },
    { month: 'May', cleanings: 148, recare: 96, newPatients: 55 },
    { month: 'Jun', cleanings: 172, recare: 118, newPatients: 67 },
  ];

  const recareEffectiveness = [
    { name: 'On Schedule', value: 65, color: '#4BC5BD' },
    { name: 'Overdue < 3m', value: 20, color: '#6B4C9A' },
    { name: 'Overdue 3-6m', value: 10, color: '#C5A572' },
    { name: 'Overdue > 6m', value: 5, color: '#1B2B5B' },
  ];

  const hygienistPerformance = [
    { name: 'Dr. Sarah', cleanings: 58, production: 12500, efficiency: 95 },
    { name: 'Dr. Michael', cleanings: 52, production: 11800, efficiency: 92 },
    { name: 'Dr. Emily', cleanings: 62, production: 13200, efficiency: 97 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hygiene Analytics</h2>
          <p className="text-sm text-gray-500">Hygiene department performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Monthly Cleanings', value: '172', trend: '+8%', icon: 'Brush' },
          { label: 'Recare Rate', value: '85%', trend: '+5%', icon: 'CalendarCheck' },
          { label: 'Production/Hour', value: '$225', trend: '+12%', icon: 'TrendingUp' },
          { label: 'Cancellation Rate', value: '12%', trend: '-3%', icon: 'XCircle' },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              {React.createElement(Icons[stat.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary"
              })}
              <span className={`text-sm font-medium ${
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hygiene Trends */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Hygiene Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hygieneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cleanings"
                stroke="#4BC5BD"
                strokeWidth={2}
                dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="recare"
                stroke="#6B4C9A"
                strokeWidth={2}
                dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="newPatients"
                stroke="#C5A572"
                strokeWidth={2}
                dot={{ fill: '#C5A572', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recare Effectiveness */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Recare Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={recareEffectiveness}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {recareEffectiveness.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hygienist Performance */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Hygienist Performance</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hygienistPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#4BC5BD" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B4C9A" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cleanings" fill="#4BC5BD" name="Cleanings" />
              <Bar yAxisId="right" dataKey="efficiency" fill="#6B4C9A" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Perio Maintenance</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">32%</span>
            <span className="text-sm text-green-600">+5% vs last month</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fluoride Treatment</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">78%</span>
            <span className="text-sm text-green-600">+3% vs last month</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">X-Ray Compliance</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">91%</span>
            <span className="text-sm text-green-600">+2% vs last month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};