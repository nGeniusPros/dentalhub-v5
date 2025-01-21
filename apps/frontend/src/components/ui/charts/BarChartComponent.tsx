import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart } from './BaseChart';

interface BarData {
  [key: string]: string | number;
}

interface BarConfig {
  key: string;
  color: string;
  name?: string;
}

interface BarChartProps {
  data: BarData[];
  bars: BarConfig[];
  xAxisKey: string;
  title?: string;
  height?: number;
  stacked?: boolean;
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisKey,
  title,
  height,
  stacked = false
}) => {
  return (
    <BaseChart title={title} height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#1B2B5B', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#1B2B5B', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.key}
            name={bar.name || bar.key}
            fill={bar.color}
            stackId={stacked ? 'stack' : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </BaseChart>
  );
};