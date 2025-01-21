import { apiClient } from '../config/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const dashboardService = {
  async getStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return {
        monthlyRevenue: {
          value: 145678,
          change: 8
        },
        patientGrowth: {
          value: 3456,
          change: 12
        },
        treatmentAcceptance: {
          value: 78,
          change: 5
        },
        appointmentFillRate: {
          value: 92,
          change: 3
        },
        insuranceClaims: {
          value: 245,
          change: 7
        },
        averageWaitTime: {
          value: 12,
          change: -4
        },
        patientSatisfaction: {
          value: 4.8,
          change: 2
        },
        staffProductivity: {
          value: 94,
          change: 6
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getRevenueAnalytics() {
    try {
      const response = await apiClient.get('/dashboard/revenue-analytics');
      return {
        monthlyRevenue: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          revenue: [120000, 125000, 128000, 130000, 127000, 132000],
          expenses: [85000, 88000, 90000, 92000, 89000, 91000],
          profit: [35000, 37000, 38000, 38000, 38000, 41000]
        },
        revenueByService: [
          { service: 'General Dentistry', value: 45, color: '#40E0D0' },
          { service: 'Orthodontics', value: 25, color: '#8B5CF6' },
          { service: 'Cosmetic', value: 20, color: '#DEB887' },
          { service: 'Implants', value: 10, color: '#1E40AF' }
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  async getPatientMetrics() {
    try {
      const response = await apiClient.get('/dashboard/patient-metrics');
      return {
        patientGrowth: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          values: [45, 52, 49, 55, 59, 65]
        },
        demographics: [
          { ageGroup: '18-30', percentage: 25 },
          { ageGroup: '31-50', percentage: 45 },
          { ageGroup: '51-70', percentage: 20 },
          { ageGroup: '70+', percentage: 10 }
        ]
      };
    } catch (error) {
      console.error('Error fetching patient metrics:', error);
      throw error;
    }
  },

  async getStaffMetrics() {
    try {
      const response = await apiClient.get('/dashboard/staff-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff metrics:', error);
      throw error;
    }
  },

  async getMarketingMetrics() {
    try {
      const response = await apiClient.get('/dashboard/marketing-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  },

  async getTreatmentAnalytics() {
    try {
      const response = await apiClient.get('/dashboard/treatment-analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching treatment analytics:', error);
      throw error;
    }
  },

  async getAppointmentOverview() {
    try {
      const response = await apiClient.get('/dashboard/appointment-overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment overview:', error);
      throw error;
    }
  },

  async getHygieneAnalytics() {
    try {
      const response = await apiClient.get('/dashboard/hygiene-analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching hygiene analytics:', error);
      throw error;
    }
  }
};