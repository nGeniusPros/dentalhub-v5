import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface AppointmentsChartProps {
  data: Array<{
    month: string;
    appointments: number;
  }>;
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ data }) => {
  return (
    <ChartContainer title="Appointments Overview">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6B4C9A" stopOpacity={0.8}/>
              <stop offset="50%" stopColor="#4BC5BD" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#41B38A" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#1B2B5B', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#1B2B5B', fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip
            cursor={{ stroke: '#4BC5BD', strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 8px 16px -4px rgba(27, 43, 91, 0.1)',
              padding: '12px'
            }}
            labelStyle={{ color: '#1B2B5B', fontWeight: 600 }}
            itemStyle={{ color: '#6B4C9A' }}
          />
          <Area
            type="monotone"
            dataKey="appointments"
            stroke="url(#appointmentsGradient)"
            strokeWidth={2}
            fill="url(#appointmentsGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};