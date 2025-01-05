import { EmailService } from '../api/src/services/emailService';

export class BeehiivService {
  private static instance: BeehiivService;
  private emailService: EmailService;

	private constructor() {
    this.emailService = new EmailService();
  }

  public static getInstance(): BeehiivService {
			if (!BeehiivService.instance) {
      BeehiivService.instance = new BeehiivService();
    }
    return BeehiivService.instance;
  }

  // Publication Management
	async getPublications() {
      return this.emailService.getPublications();
  }

  async getPublicationStats(publicationId: string) {
      return this.emailService.getPublicationStats(publicationId);
  }

  // Email Analytics
  async getEmailAnalytics(publicationId: string, startDate: string, endDate?: string) {
    return this.emailService.getEmailAnalytics(publicationId, startDate, endDate);
  }
}