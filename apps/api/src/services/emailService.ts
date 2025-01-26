import axios from "axios";

export class EmailService {
  private apiKey: string;
  private apiBaseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_BEEHIIV_API_KEY!;
    this.apiBaseUrl = "https://api.beehiiv.com/v2"; // Replace with the actual base URL
  }

  private async request<T>(
    endpoint: string,
    method: "get" | "post" | "put" | "delete",
    data?: any,
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Beehiiv API error:",
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  }

  // Publication Management
  async getPublications() {
    return this.request(`/publications`, "get");
  }

  async getPublicationStats(publicationId: string) {
    return this.request(`/publications/${publicationId}/stats`, "get");
  }

  // Email Analytics
  async getEmailAnalytics(
    publicationId: string,
    startDate: string,
    endDate?: string,
  ) {
    let url = `/publications/${publicationId}/emails?startDate=${startDate}`;
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    return this.request(url, "get");
  }
}
