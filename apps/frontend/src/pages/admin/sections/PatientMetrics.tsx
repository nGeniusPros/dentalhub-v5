import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Button } from '../../../components/ui/button';

export const PatientMetrics = () => {
  const patientGrowth = [
    { month: 'Jan', newPatients: 45, activePatients: 1200, retentionRate: 95 },
    { month: 'Feb', newPatients: 52, activePatients: 1250, retentionRate: 94 },
    { month: 'Mar', newPatients: 48, activePatients: 1290, retentionRate: 96 },
    { month: 'Apr', newPatients: 61, activePatients: 1340, retentionRate: 95 },
    { month: 'May', newPatients: 55, activePatients: 1380, retentionRate: 93 },
    { month: 'Jun', newPatients: 67, activePatients: 1430, retentionRate: 97 },
  ];

  const satisfactionMetrics = [
    { name: 'Overall', value: 94, fill: '#4BC5BD' },
    { name: 'Staff', value: 96, fill: '#6B4C9A' },
    { name: 'Cleanliness', value: 98, fill: '#C5A572' },
    { name: 'Wait Time', value: 88, fill: '#1B2B5B' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Patient Analytics</h2>
          <p className="text-sm text-gray-500">Patient growth and satisfaction metrics</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Patient Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={patientGrowth}>
              <defs>
                <linearGradient id="colorNewPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4BC5BD" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4BC5BD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="newPatients"
                stroke="#4BC5BD"
                fillOpacity={1}
                fill="url(#colorNewPatients)"
                name="New Patients"
              />
              <Line
                type="monotone"
                dataKey="retentionRate"
                stroke="#6B4C9A"
                name="Retention Rate %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Satisfaction */}
        <div className="h-[300px]">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Satisfaction Metrics (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="100%"
              data={satisfactionMetrics}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise={true}
                dataKey="value"
                cornerRadius={10}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Patient Demographics</h3>
        <div className="space-y-4">
          {[
            { label: '18-30', percentage: 25 },
            { label: '31-50', percentage: 45 },
            { label: '51-70', percentage: 20 },
            { label: '70+', percentage: 10 }
          ].map((age, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{age.label}</span>
                <span className="text-gray-900">{age.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${age.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};