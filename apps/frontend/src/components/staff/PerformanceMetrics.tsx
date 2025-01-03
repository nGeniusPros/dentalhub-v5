```typescript
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface PerformanceMetric {
  category: string;
  metrics: {
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    unit: string;
  }[];
}

export const PerformanceMetrics = () => {
  const metrics: PerformanceMetric[] = [
    {
      category: 'Patient Care',
      metrics: [
        { name: 'Patient Satisfaction', value: 95, target: 90, trend: 'up', unit: '%' },
        { name: 'Treatment Acceptance', value: 82, target: 80, trend: 'up', unit: '%' },
        { name: 'Patient Retention', value: 88, target: 85, trend: 'stable', unit: '%' }
      ]
    },
    {
      category: 'Productivity',
      metrics: [
        { name: 'Appointments/Day', value: 12, target: 10, trend: 'up', unit: '' },
        { name: 'Production/Hour', value: 450, target: 400, trend: 'up', unit: '$' },
        { name: 'Chair Time Utilization', value: 85, target: 80, trend: 'stable', unit: '%' }
      ]
    },
    {
      category: 'Quality',
      metrics: [
        { name: 'Treatment Success Rate', value: 98, target: 95, trend: 'up', unit: '%' },
        { name: 'Documentation Accuracy', value: 96, target: 95, trend: 'stable', unit: '%' },
        { name: 'Protocol Adherence', value: 97, target: 95, trend: 'up', unit: '%' }
      ]
    },
    {
      category: 'Efficiency',
      metrics: [
        { name: 'On-Time Performance', value: 92, target: 90, trend: 'up', unit: '%' },
        { name: 'Patient Wait Time', value: 8, target: 10, trend: 'down', unit: 'min' },
        { name: 'Treatment Plan Completion', value: 87, target: 85, trend: 'up', unit: '%' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-medium mb-4">{category.category}</h3>
            <div className="space-y-4">
              {category.metrics.map((metric, mIndex) => (
                <div key={mIndex} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {metric.unit === '$' ? `$${metric.value}` : `${metric.value}${metric.unit}`}
                      </span>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        metric.trend === 'up' ? "text-green-600" :
                        metric.trend === 'down' ? "text-red-600" :
                        "text-gray-600"
                      )}>
                        {metric.trend === 'up' && <Icons.TrendingUp className="w-4 h-4" />}
                        {metric.trend === 'down' && <Icons.TrendingDown className="w-4 h-4" />}
                        {metric.trend === 'stable' && <Icons.Minus className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                        metric.value >= metric.target ? "bg-green-500" : "bg-yellow-500"
                      )}
                      style={{ width: `${(metric.value / metric.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {metric.unit === '$' ? `$${metric.target}` : `${metric.target}${metric.unit}`}</span>
                    <span>{((metric.value / metric.target) * 100).toFixed(1)}% of target</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```