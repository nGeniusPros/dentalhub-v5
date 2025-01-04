import { useEffect, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase, subscribeToChanges } from '../../lib/supabase/client';
import {
  Appointment,
  Message,
  Notification,
  PatientRecord,
  StaffSchedule
} from '../../lib/supabase/database.types';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions<T> {
  table: string;
  event?: RealtimeEvent;
  initialData?: T[];
  onDataChange?: (data: T[]) => void;
  filter?: (item: T) => boolean;
}

export function useRealtime<T extends { id: string | number }>(
  options: UseRealtimeOptions<T>
) {
  const { table, event = '*', initialData = [], onDataChange, filter } = options;
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: initialData, error } = await supabase
          .from(table)
          .select('*');

        if (error) throw error;

        const filteredData = filter ? initialData.filter(filter) : initialData;
        setData(filteredData as T[]);
        if (onDataChange) onDataChange(filteredData as T[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, filter]);

  // Realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToChanges<T, RealtimePostgresChangesPayload<T>>(
      table,
      (payload) => {
        const newRecord = payload.new as T;
        const oldRecord = payload.old as T;

        setData((currentData) => {
          let updatedData = [...currentData];

          switch (payload.eventType) {
            case 'INSERT':
              if (!filter || filter(newRecord)) {
                updatedData = [...updatedData, newRecord];
              }
              break;

            case 'UPDATE':
              updatedData = updatedData.map((item) =>
                item.id === (newRecord as any).id ? newRecord : item
              );
              if (filter) {
                updatedData = updatedData.filter(filter);
              }
              break;

            case 'DELETE':
              updatedData = updatedData.filter((item) => item.id !== (oldRecord as any).id);
              break;
          }

          if (onDataChange) onDataChange(updatedData);
          return updatedData;
        });
      },
      event
    );

    return () => {
      unsubscribe();
    };
  }, [table, event, filter, onDataChange]);

  return {
    data,
    error,
    loading,
    mutate: setData
  };
}

// Specialized hooks for specific features
export function useAppointments(options: Omit<UseRealtimeOptions<Appointment>, 'table'> = {}) {
  return useRealtime<Appointment>({
    ...options,
    table: 'appointments'
  });
}

export function usePatientRecords(options: Omit<UseRealtimeOptions<PatientRecord>, 'table'> = {}) {
  return useRealtime<PatientRecord>({
    ...options,
    table: 'patient_records'
  });
}

export function useStaffSchedules(options: Omit<UseRealtimeOptions<StaffSchedule>, 'table'> = {}) {
  return useRealtime<StaffSchedule>({
    ...options,
    table: 'staff_schedules'
  });
}

export function useMessages(options: Omit<UseRealtimeOptions<Message>, 'table'> = {}) {
  return useRealtime<Message>({
    ...options,
    table: 'messages'
  });
}

export function useNotifications(options: Omit<UseRealtimeOptions<Notification>, 'table'> = {}) {
  return useRealtime<Notification>({
    ...options,
    table: 'notifications'
  });
}