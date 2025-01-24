import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { KPIOverview } from './components/KPIOverview';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { PatientMetricsChart } from '@/components/charts/PatientMetricsChart';
import { StaffPerformance } from '@/components/staff/StaffPerformance';
import { AppointmentOverview } from '@/components/appointments/AppointmentOverview';

// Sample data - Replace with actual data from your API
const revenueData = [
  { name: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
  { name: 'Feb', revenue: 75000, expenses: 48000, profit: 27000 },
  { name: 'Mar', revenue: 85000, expenses: 52000, profit: 33000 },
  { name: 'Apr', revenue: 95000, expenses: 55000, profit: 40000 },
  { name: 'May', revenue: 105000, expenses: 58000, profit: 47000 },
  { name: 'Jun', revenue: 115000, expenses: 62000, profit: 53000 },
];

const patientData = [
  { name: 'Jan', newPatients: 45, returningPatients: 65, referrals: 20 },
  { name: 'Feb', newPatients: 50, returningPatients: 70, referrals: 25 },
  { name: 'Mar', newPatients: 55, returningPatients: 75, referrals: 30 },
  { name: 'Apr', newPatients: 60, returningPatients: 80, referrals: 35 },
  { name: 'May', newPatients: 65, returningPatients: 85, referrals: 40 },
  { name: 'Jun', newPatients: 70, returningPatients: 90, referrals: 45 },
];

const staffData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Lead Dentist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    metrics: {
      patientsSeen: 128,
      satisfaction: 98,
      efficiency: 95,
    },
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Orthodontist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    metrics: {
      patientsSeen: 96,
      satisfaction: 96,
      efficiency: 92,
    },
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    role: 'Dental Surgeon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    metrics: {
      patientsSeen: 84,
      satisfaction: 94,
      efficiency: 90,
    },
  },
];

const appointmentData = [
  {
    id: '1',
    patientName: 'John Smith',
    time: '09:00 AM',
    type: 'Check-up',
    status: 'confirmed',
  },
  {
    id: '2',
    patientName: 'Emma Davis',
    time: '10:30 AM',
    type: 'Cleaning',
    status: 'in-progress',
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    time: '11:45 AM',
    type: 'Consultation',
    status: 'scheduled',
  },
  {
    id: '4',
    patientName: 'Sophie Wilson',
    time: '02:15 PM',
    type: 'Follow-up',
    status: 'scheduled',
  },
] as const;

export const AdminDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RevenueChart data={revenueData} timeRange={selectedTimeRange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PatientMetricsChart data={patientData} timeRange={selectedTimeRange} />
        </motion.div>
      </div>

      {/* Staff and Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StaffPerformance staffMembers={staffData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AppointmentOverview appointments={appointmentData} />
        </motion.div>
      </div>
    </motion.div>
  );
};