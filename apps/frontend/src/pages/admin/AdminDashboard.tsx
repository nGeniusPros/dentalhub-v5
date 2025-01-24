import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from './components/DashboardHeader';
import { KPIOverview } from './components/KPIOverview';
import { RevenueAnalytics } from './analytics/components/RevenueAnalytics';
import { PatientMetrics } from './analytics/components/PatientMetrics';
import { StaffPerformance } from './analytics/components/StaffPerformance';
import { AppointmentOverview } from './analytics/components/AppointmentOverview';

export const AdminDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <DashboardHeader />

      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {['day', 'week', 'month', 'year'].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>

      {/* KPI Overview */}
      <KPIOverview timeRange={selectedTimeRange} />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Revenue Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RevenueAnalytics timeRange={selectedTimeRange} />
          </motion.div>

          {/* Patient Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PatientMetrics timeRange={selectedTimeRange} />
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Staff Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StaffPerformance timeRange={selectedTimeRange} />
          </motion.div>

          {/* Appointment Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AppointmentOverview timeRange={selectedTimeRange} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};