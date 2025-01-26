import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { KPIMetrics, AppointmentOverview, RevenueAnalytics } from '../types/dashboard';

interface DashboardData {
  kpiMetrics: KPIMetrics | null;
  appointmentOverview: AppointmentOverview | null;
  revenueAnalytics: RevenueAnalytics | null;
}

interface DashboardSection {
  id: string;
  loading: boolean;
  error: string | null;
  retry: () => Promise<void>;
}

interface DashboardDataHook {
  data: DashboardData;
  sections: Record<string, DashboardSection>;
  prefetchNextPage: () => Promise<void>;
  hasMoreData: boolean;
  isInitialLoading: boolean;
}

const PAGE_SIZE = 20;

export const useDashboardData = (userId: string | undefined): DashboardDataHook => {
  const supabase = useSupabaseClient();
  const [data, setData] = useState<DashboardData>({
    kpiMetrics: null,
    appointmentOverview: null,
    revenueAnalytics: null,
  });
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [sections, setSections] = useState<Record<string, DashboardSection>>({
    kpi: { id: 'kpi', loading: true, error: null, retry: async () => {} },
    appointments: { id: 'appointments', loading: true, error: null, retry: async () => {} },
    revenue: { id: 'revenue', loading: true, error: null, retry: async () => {} },
  });

  // Update section status
  const updateSection = useCallback((id: string, updates: Partial<DashboardSection>) => {
    setSections(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  }, []);

  // Prefetch data for the next page
  const prefetchNextPage = useCallback(async () => {
    if (!userId || !hasMoreData) return;

    try {
      const startIndex = page * PAGE_SIZE;
      const [appointmentsResponse, revenueResponse] = await Promise.all([
        fetch(`/api/dashboard/appointment-overview?offset=${startIndex}&limit=${PAGE_SIZE}`),
        fetch(`/api/dashboard/revenue-analytics?offset=${startIndex}&limit=${PAGE_SIZE}`)
      ]);

      const [appointmentsData, revenueData] = await Promise.all([
        appointmentsResponse.json(),
        revenueResponse.json()
      ]);

      // Update data with new items
      setData(prev => ({
        ...prev,
        appointmentOverview: {
          ...prev.appointmentOverview!,
          todayAppointments: [
            ...prev.appointmentOverview!.todayAppointments,
            ...appointmentsData.todayAppointments
          ]
        },
        revenueAnalytics: {
          ...prev.revenueAnalytics!,
          monthlyRevenue: {
            ...prev.revenueAnalytics!.monthlyRevenue,
            months: [...prev.revenueAnalytics!.monthlyRevenue.months, ...revenueData.monthlyRevenue.months],
            revenue: [...prev.revenueAnalytics!.monthlyRevenue.revenue, ...revenueData.monthlyRevenue.revenue],
            expenses: [...prev.revenueAnalytics!.monthlyRevenue.expenses, ...revenueData.monthlyRevenue.expenses],
            profit: [...prev.revenueAnalytics!.monthlyRevenue.profit, ...revenueData.monthlyRevenue.profit]
          }
        }
      }));

      setPage(prev => prev + 1);
      setHasMoreData(appointmentsData.todayAppointments.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error prefetching next page:', error);
    }
  }, [userId, page, hasMoreData]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) return;

      try {
        setIsInitialLoading(true);

        // Fetch KPI Metrics
        const fetchKPIMetrics = async () => {
          try {
            updateSection('kpi', { loading: true, error: null });
            const response = await fetch('/api/dashboard/kpi-metrics');
            if (!response.ok) throw new Error('Failed to fetch KPI metrics');
            const kpiData = await response.json();
            setData(prev => ({ ...prev, kpiMetrics: kpiData }));
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch KPI metrics';
            updateSection('kpi', { error: message });
          } finally {
            updateSection('kpi', { loading: false });
          }
        };

        // Fetch initial appointments page
        const fetchAppointments = async () => {
          try {
            updateSection('appointments', { loading: true, error: null });
            const response = await fetch(`/api/dashboard/appointment-overview?offset=0&limit=${PAGE_SIZE}`);
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const appointmentsData = await response.json();
            setData(prev => ({ ...prev, appointmentOverview: appointmentsData }));
            setHasMoreData(appointmentsData.todayAppointments.length === PAGE_SIZE);
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch appointments';
            updateSection('appointments', { error: message });
          } finally {
            updateSection('appointments', { loading: false });
          }
        };

        // Fetch initial revenue data
        const fetchRevenue = async () => {
          try {
            updateSection('revenue', { loading: true, error: null });
            const response = await fetch(`/api/dashboard/revenue-analytics?offset=0&limit=${PAGE_SIZE}`);
            if (!response.ok) throw new Error('Failed to fetch revenue data');
            const revenueData = await response.json();
            setData(prev => ({ ...prev, revenueAnalytics: revenueData }));
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch revenue data';
            updateSection('revenue', { error: message });
          } finally {
            updateSection('revenue', { loading: false });
          }
        };

        // Set up retry functions
        setSections(prev => ({
          ...prev,
          kpi: { ...prev.kpi, retry: fetchKPIMetrics },
          appointments: { ...prev.appointments, retry: fetchAppointments },
          revenue: { ...prev.revenue, retry: fetchRevenue },
        }));

        // Fetch initial data
        await Promise.all([
          fetchKPIMetrics(),
          fetchAppointments(),
          fetchRevenue(),
        ]);

        // Start prefetching next page
        prefetchNextPage();

      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [userId, updateSection, prefetchNextPage]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`dashboard-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'revenue_entries',
      }, async () => {
        const response = await fetch('/api/dashboard/kpi-metrics');
        const kpiData = await response.json();
        setData(prev => ({ ...prev, kpiMetrics: kpiData }));
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
      }, async () => {
        const response = await fetch(`/api/dashboard/appointment-overview?offset=0&limit=${PAGE_SIZE}`);
        const appointmentsData = await response.json();
        setData(prev => ({ ...prev, appointmentOverview: appointmentsData }));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, supabase]);

  return {
    data,
    sections,
    prefetchNextPage,
    hasMoreData,
    isInitialLoading,
  };
};
