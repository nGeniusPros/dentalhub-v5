import axios from 'axios';

export class InstantlyService {
  private apiKey: string;
  private apiBaseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_INSTANTLY_API_KEY!;
    this.apiBaseUrl = 'https://api.instantly.ai/v1'; // Replace with the actual base URL
  }

  private async request<T>(endpoint: string, method: 'get' | 'post' | 'put' | 'delete', data?: any): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      console.error('Instantly API error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Campaign Management
  async getCampaigns(skip: number = 0, limit: number = 10) {
    return this.request(`/campaigns?skip=${skip}&limit=${limit}`, 'get');
  }

  async getCampaignStatus(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/status`, 'get');
  }

  // Email Analytics
  async getEmailAnalytics(campaignId: string, startDate: string, endDate?: string) {
    let url = `/analytics/emails?campaignId=${campaignId}&startDate=${startDate}`;
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    return this.request(url, 'get');
  }
}