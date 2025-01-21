export declare class EmailService {
    private apiKey;
    private apiBaseUrl;
    constructor();
    private request;
    getPublications(): Promise<unknown>;
    getPublicationStats(publicationId: string): Promise<unknown>;
    getEmailAnalytics(publicationId: string, startDate: string, endDate?: string): Promise<unknown>;
}
