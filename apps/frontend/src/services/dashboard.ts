import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const dashboardService = {
  async getRevenueAnalytics() {
    const response = await axios.get(`${API_BASE_URL}/dashboard/revenue-analytics`);
    return response.data;
  },
  async getStats() {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    return response.data;
  }
};