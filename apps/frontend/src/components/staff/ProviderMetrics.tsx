```typescript
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ProviderMetric {
  category: string;
  metrics: {
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    unit: string;
  }[];
}

export const ProviderMetrics = () => {
  const metrics: ProviderMetric[] = [
    {
      category: 'Clinical Performance',
      metrics: [
        { name: 'Treatment Success Rate', value: 98, target: 95, trend: 'up', unit: '%' },
        { name: 'Patient Satisfaction', value: 4.8, target: 4.5, trend: 'up', unit: '/5' },
        { name: 'Case Completion Rate', value: 92, target: 90, trend: 'up', unit: '%' }
      ]
    },
    {
      category: 'Production',
      metrics: [
        { name: 'Daily Production', value: 5200, target: 5000, trend: 'up', unit: '$' },
        { name: 'Procedures/Day', value: 8.5, target: 8, trend: 'up', unit: '' },
        { name: 'Treatment Plan Acceptance', value: 85, target: 80, trend: 'up', unit: '%' }
      ]
    },
    {
      category: 'Quality Measures',
      metrics: [
        { name: 'Documentation Quality', value: 96, target: 95, trend: 'stable', unit: '%' },
        { name: 'Complication Rate', value: 0.5, target: 1, trend: 'down', unit: '%' },
        { name: 'Follow-up Compliance', value: 94, target: 90, trend: 'up', unit: '%' }
      ]
    },
    {
      category: 'Patient Management',
      metrics: [
        { name: 'Patient Retention', value: 92, target: 90, trend: 'up', unit: '%' },
        { name: 'New Patient Conversion', value: 85, target: 80, trend: 'up', unit: '%' },
        { name: 'Referral Generation', value: 4.2, target: 4, trend: 'up', unit: '/month' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Provider Performance</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
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