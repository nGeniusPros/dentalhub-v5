import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: keyof typeof Icons;
}

export const PracticeAnalytics: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$128,450',
      change: 12.5,
      icon: 'DollarSign',
    },
    {
      title: 'Active Patients',
      value: '1,245',
      change: 8.2,
      icon: 'Users',
    },
    {
      title: 'Treatment Success Rate',
      value: '94%',
      change: 3.1,
      icon: 'CheckCircle',
    },
    {
      title: 'Patient Satisfaction',
      value: '4.8/5',
      change: 5.7,
      icon: 'ThumbsUp',
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 82000 },
    { month: 'Feb', revenue: 75000 },
    { month: 'Mar', revenue: 95000 },
    { month: 'Apr', revenue: 88000 },
    { month: 'May', revenue: 102000 },
    { month: 'Jun', revenue: 128450 },
  ];

  const patientDistribution = [
    { name: 'Regular Checkups', value: 45 },
    { name: 'Treatments', value: 30 },
    { name: 'Emergencies', value: 15 },
    { name: 'Consultations', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = Icons[metric.icon];
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    metric.change > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0088FE"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Patient Visit Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={patientDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {patientDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
