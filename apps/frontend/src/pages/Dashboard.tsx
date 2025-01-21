import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { AppointmentsChart } from '../components/dashboard/charts/AppointmentsChart';
import { RevenueChart } from '../components/dashboard/charts/RevenueChart';

const data = [
  { month: 'Jan', appointments: 65, revenue: 12400 },
  { month: 'Feb', appointments: 59, revenue: 11800 },
  { month: 'Mar', appointments: 80, revenue: 15600 },
  { month: 'Apr', appointments: 81, revenue: 16100 },
  { month: 'May', appointments: 56, revenue: 10900 },
  { month: 'Jun', appointments: 55, revenue: 10700 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">Ngenius Dental Hub</h1>
          <p className="text-ngenius-gray-500 mt-1">Welcome back, Dr. Sarah Wilson</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-ngenius-gray-700 bg-ngenius-white border border-ngenius-gray-200 rounded-lg hover:bg-ngenius-gray-50">
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-ngenius-white bg-ngenius-primary rounded-lg hover:bg-ngenius-primary/90">
            Add Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value="1,234"
          change={12}
          icon="Users"
          variant="primary"
        />
        <StatsCard
          title="Today's Appointments"
          value="8"
          icon="Calendar"
          variant="secondary"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$45,678"
          change={8}
          icon="DollarSign"
          variant="accent1"
        />
        <StatsCard
          title="Pending Reports"
          value="5"
          icon="FileText"
          variant="accent2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart data={data} />
        <RevenueChart data={data} />
      </div>
    </div>
  );
};

export default Dashboard;