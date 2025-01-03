```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, RadialBarChart, RadialBar 
} from 'recharts';
import { Button } from '../../ui/button';
import * as Icons from 'lucide-react';

export const PerformanceCharts = () => {
  // Productivity Trends Data
  const productivityData = [
    { month: 'Jan', appointments: 145, production: 52000, efficiency: 92 },
    { month: 'Feb', appointments: 132, production: 48000, efficiency: 88 },
    { month: 'Mar', appointments: 156, production: 61000, efficiency: 94 },
    { month: 'Apr', appointments: 142, production: 55000, efficiency: 90 },
    { month: 'May', appointments: 151, production: 59000, efficiency: 91 },
    { month: 'Jun', appointments: 160, production: 63000, efficiency: 95 }
  ];

  // Patient Satisfaction Data
  const satisfactionData = [
    { name: 'Very Satisfied', value: 65, color: '#4BC5BD' },
    { name: 'Satisfied', value: 25, color: '#6B4C9A' },
    { name: 'Neutral', value: 7, color: '#C5A572' },
    { name: 'Dissatisfied', value: 3, color: '#1B2B5B' }
  ];

  // Treatment Success Rate Data
  const treatmentData = [
    { name: 'Cleanings', success: 98, total: 245 },
    { name: 'Fillings', success: 96, total: 180 },
    { name: 'Root Canals', success: 94, total: 45 },
    { name: 'Crowns', success: 95, total: 65 }
  ];

  // Staff Efficiency Data
  const efficiencyData = [
    { name: 'Dr. Sarah', value: 95, fill: '#4BC5BD' },
    { name: 'Dr. Michael', value: 92, fill: '#6B4C9A' },
    { name: 'Dr. Emily', value: 97, fill: '#C5A572' }
  ];

  return (
    <div className="space-y-6">
      {/* Productivity Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Productivity Trends</h3>
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#4BC5BD" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B4C9A" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="appointments"
                name="Appointments"
                stroke="#4BC5BD"
                strokeWidth={2}
                dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="production"
                name="Production ($)"
                stroke="#6B4C9A"
                strokeWidth={2}
                dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Patient Satisfaction</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Treatment Success Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Treatment Success Rates</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" name="Success Rate" fill="#4BC5BD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total Procedures" fill="#6B4C9A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Staff Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Staff Efficiency</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                data={efficiencyData}
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
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Revenue Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="production"
                  name="Revenue"
                  stroke="#4BC5BD"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
```