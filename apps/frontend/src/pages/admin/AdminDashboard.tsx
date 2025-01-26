import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '../../components/KPICard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PatientMetricsChart } from '../../components/charts/PatientMetricsChart';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../hooks/useAuth';
import { KPIMetrics, AppointmentOverview, RevenueAnalytics } from '../../types/dashboard';

export const AdminDashboard = () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);
  const [appointmentOverview, setAppointmentOverview] = useState<AppointmentOverview | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch initial data
        const [kpiResponse, appointmentResponse, revenueResponse] = await Promise.all([
          fetch('/api/dashboard/kpi-metrics'),
          fetch('/api/dashboard/appointment-overview'),
          fetch('/api/dashboard/revenue-analytics')
        ]);

        const [kpiData, appointmentData, revenueData] = await Promise.all([
          kpiResponse.json(),
          appointmentResponse.json(),
          revenueResponse.json()
        ]);

        setKpiMetrics(kpiData);
        setAppointmentOverview(appointmentData);
        setRevenueAnalytics(revenueData);

        // Setup real-time subscriptions
        const channel = supabase
          .channel(`dashboard-${user?.id}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'revenue_entries',
          }, async () => {
            const response = await fetch('/api/dashboard/kpi-metrics');
            const updatedKpiData = await response.json();
            setKpiMetrics(updatedKpiData);
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'appointments',
          }, async () => {
            const response = await fetch('/api/dashboard/appointment-overview');
            const updatedAppointmentData = await response.json();
            setAppointmentOverview(updatedAppointmentData);
          })
          .subscribe();

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpiMetrics && (
          <>
            <KPICard
              title="Monthly Revenue"
              value={kpiMetrics.monthlyRevenue.value}
              change={kpiMetrics.monthlyRevenue.change}
              trend={kpiMetrics.monthlyRevenue.trend}
            />
            <KPICard
              title="Total Patients"
              value={kpiMetrics.totalPatients.value}
              change={kpiMetrics.totalPatients.change}
              trend={kpiMetrics.totalPatients.trend}
            />
            <KPICard
              title="Appointments"
              value={kpiMetrics.appointments.value}
              change={kpiMetrics.appointments.change}
              trend={kpiMetrics.appointments.trend}
            />
            <KPICard
              title="Growth Rate"
              value={kpiMetrics.growthRate.value}
              change={kpiMetrics.growthRate.change}
              trend={kpiMetrics.growthRate.trend}
            />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueAnalytics && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <RevenueChart data={revenueAnalytics} />
          </motion.div>
        )}

        {appointmentOverview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {appointmentOverview.todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <p className={`text-sm ${
                      appointment.status === 'completed' ? 'text-green-500' :
                      appointment.status === 'cancelled' ? 'text-red-500' :
                      'text-blue-500'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
