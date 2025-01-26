import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending';
}

interface UsePatientOptions {
  pageSize?: number;
  initialSearchTerm?: string;
}

export interface PatientFilter {
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  status?: 'active' | 'inactive' | 'pending' | 'all';
  sortBy?: 'name' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

interface UsePatientResult {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refresh: () => Promise<void>;
  filters: PatientFilter;
  setFilters: (filters: PatientFilter) => void;
  selectedPatients: string[];
  setSelectedPatients: (ids: string[]) => void;
  bulkUpdateStatus: (status: 'active' | 'inactive' | 'pending') => Promise<void>;
  bulkDelete: () => Promise<void>;
}

export const usePatients = ({
  pageSize = 10,
  initialSearchTerm = '',
}: UsePatientOptions = {}): UsePatientResult => {
  const supabase = useSupabaseClient();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [filters, setFilters] = useState<PatientFilter>({
    dateRange: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
      case 'month':
        return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
      case 'year':
        return { start: startOfDay(subDays(now, 365)), end: endOfDay(now) };
      default:
        return null;
    }
  };

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build query
      let query = supabase
        .from('patients')
        .select('*', { count: 'exact' });

      // Add search if term exists
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      // Add status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Add date range filter
      const dateRange = getDateRangeFilter();
      if (dateRange) {
        query = query.gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      // Add sorting
      if (filters.sortBy) {
        const sortField = filters.sortBy === 'name' ? 'first_name' : filters.sortBy;
        query = query.order(sortField, { ascending: filters.sortOrder === 'asc' });
      }

      // Add pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setPatients(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patients';
      setError(message);
      toast.error(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const bulkUpdateStatus = async (status: 'active' | 'inactive' | 'pending') => {
    try {
      if (selectedPatients.length === 0) return;

      const { error } = await supabase
        .from('patients')
        .update({ status })
        .in('id', selectedPatients);

      if (error) throw error;

      toast.success(`Successfully updated ${selectedPatients.length} patients`);
      setSelectedPatients([]);
      fetchPatients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update patients';
      toast.error(`Error: ${message}`);
    }
  };

  const bulkDelete = async () => {
    try {
      if (selectedPatients.length === 0) return;

      const { error } = await supabase
        .from('patients')
        .delete()
        .in('id', selectedPatients);

      if (error) throw error;

      toast.success(`Successfully deleted ${selectedPatients.length} patients`);
      setSelectedPatients([]);
      fetchPatients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete patients';
      toast.error(`Error: ${message}`);
    }
  };

  // Fetch patients when page, search term, filters, or page size changes
  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm, pageSize, filters]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('patients-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients',
      }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return {
    patients,
    isLoading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    refresh: fetchPatients,
    filters,
    setFilters,
    selectedPatients,
    setSelectedPatients,
    bulkUpdateStatus,
    bulkDelete,
  };
};
