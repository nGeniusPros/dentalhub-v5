import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StaffService } from '../services/staff';

type DateRange = 'week' | 'month' | 'quarter';

export const useStaffPerformance = () => {
  const [dateRange, setDateRange] = useState<DateRange>('week');

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    error: performanceError,
  } = useQuery(
    ['staffPerformance', dateRange],
    () => StaffService.getPerformanceMetrics(dateRange),
    {
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  const {
    data: satisfactionData,
    isLoading: isSatisfactionLoading,
    error: satisfactionError,
  } = useQuery(
    ['patientSatisfaction', dateRange],
    () => StaffService.getPatientSatisfaction(dateRange),
    {
      refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    }
  );

  const {
    data: appointmentData,
    isLoading: isAppointmentLoading,
    error: appointmentError,
  } = useQuery(
    ['appointmentMetrics', dateRange],
    () => StaffService.getAppointmentMetrics(dateRange),
    {
      refetchInterval: 5 * 60 * 1000,
    }
  );

  const {
    data: treatmentData,
    isLoading: isTreatmentLoading,
    error: treatmentError,
  } = useQuery(
    ['treatmentEfficiency', dateRange],
    () => StaffService.getTreatmentEfficiency(dateRange),
    {
      refetchInterval: 15 * 60 * 1000,
    }
  );

  return {
    performanceData: performanceData || {
      score: 0,
      trend: 0,
      patientsTreated: 0,
      avgTreatmentTime: 0,
      trend: [],
    },
    patientSatisfaction: satisfactionData || [],
    appointmentMetrics: appointmentData || {
      onTimeRate: 0,
      completionRate: 0,
      reschedulingRate: 0,
    },
    treatmentEfficiency: treatmentData || [],
    isLoading:
      isPerformanceLoading ||
      isSatisfactionLoading ||
      isAppointmentLoading ||
      isTreatmentLoading,
    error:
      performanceError ||
      satisfactionError ||
      appointmentError ||
      treatmentError,
    dateRange,
    setDateRange,
  };
};
