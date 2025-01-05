import { InstantlyService as InstantlyApiService } from '../api/src/services/instantlyService';

export class InstantlyService {
  private static instance: InstantlyService;
  private instantlyService: InstantlyApiService;

	private constructor() {
    this.instantlyService = new InstantlyApiService();
  }

  public static getInstance(): InstantlyService {
			if (!InstantlyService.instance) {
      InstantlyService.instance = new InstantlyService();
    }
    return InstantlyService.instance;
  }

  // Campaign Management
	async getCampaigns(skip: number = 0, limit: number = 10) {
    return this.instantlyService.getCampaigns(skip, limit);
  }

  async getCampaignStatus(campaignId: string) {
    return this.instantlyService.getCampaignStatus(campaignId);
  }

  // Email Analytics
  async getEmailAnalytics(campaignId: string, startDate: string, endDate?: string) {
    return this.instantlyService.getEmailAnalytics(campaignId, startDate, endDate);
  }
}