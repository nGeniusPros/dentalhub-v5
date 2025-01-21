import axios from 'axios';
export class EmailService {
    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_BEEHIIV_API_KEY;
        this.apiBaseUrl = 'https://api.beehiiv.com/v2'; // Replace with the actual base URL
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
            console.error('Beehiiv API error:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    // Publication Management
    async getPublications() {
        return this.request(`/publications`, 'get');
    }
    async getPublicationStats(publicationId) {
        return this.request(`/publications/${publicationId}/stats`, 'get');
    }
    // Email Analytics
    async getEmailAnalytics(publicationId, startDate, endDate) {
        let url = `/publications/${publicationId}/emails?startDate=${startDate}`;
        if (endDate) {
            url += `&endDate=${endDate}`;
        }
        return this.request(url, 'get');
    }
}
