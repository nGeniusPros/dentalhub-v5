import axios from 'axios';
export class InstantlyService {
    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_INSTANTLY_API_KEY;
        this.apiBaseUrl = 'https://api.instantly.ai/v1'; // Replace with the actual base URL
    }
    async request(endpoint, method, data) {
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
        }
        catch (error) {
            console.error('Instantly API error:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    // Campaign Management
    async getCampaigns(skip = 0, limit = 10) {
        return this.request(`/campaigns?skip=${skip}&limit=${limit}`, 'get');
    }
    async getCampaignStatus(campaignId) {
        return this.request(`/campaigns/${campaignId}/status`, 'get');
    }
    // Email Analytics
    async getEmailAnalytics(campaignId, startDate, endDate) {
        let url = `/analytics/emails?campaignId=${campaignId}&startDate=${startDate}`;
        if (endDate) {
            url += `&endDate=${endDate}`;
        }
        return this.request(url, 'get');
    }
}
