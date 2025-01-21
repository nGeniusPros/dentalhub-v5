export declare class InstantlyService {
    private apiKey;
    private apiBaseUrl;
    constructor();
    private request;
    getCampaigns(skip?: number, limit?: number): Promise<unknown>;
    getCampaignStatus(campaignId: string): Promise<unknown>;
    getEmailAnalytics(campaignId: string, startDate: string, endDate?: string): Promise<unknown>;
}
