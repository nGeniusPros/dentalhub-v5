import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../components/dashboard/StatsCard';
import { dashboardService } from '../../../services/dashboard';

export const KPIOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStats();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Monthly Revenue"
        value={`$${stats?.monthlyRevenue?.value?.toLocaleString() || '0'}`}
        change={stats?.monthlyRevenue?.change || 0}
        icon="DollarSign"
        variant="primary"
      />
      <StatsCard
        title="Patient Growth"
        value={stats?.totalPatients?.value || '0'}
        change={stats?.totalPatients?.change || 0}
        icon="Users"
        variant="secondary"
      />
      <StatsCard
        title="Pending Reports"
        value={stats?.pendingReports?.value || '0'}
        change={0}
        icon="FileCheck"
        variant="accent1"
      />
       <StatsCard
        title="Today Appointments"
        value={stats?.todayAppointments?.value || '0'}
        change={0}
        icon="Calendar"
        variant="accent2"
      />
				</div>
		);
};