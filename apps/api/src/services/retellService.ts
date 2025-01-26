import { Retell } from "retell-sdk";
import { logger } from "../lib/logger";
import { ErrorCode, ErrorResponse } from "../errors";

export class RetellService {
  private client: Retell;

  constructor() {
    this.validateConfig();
    this.client = new Retell({
      apiKey: process.env.VITE_RETELL_API_KEY!,
      baseUrl: process.env.VITE_RETELL_BASE_URL!,
    });
  }

  private validateConfig() {
    if (!process.env.VITE_RETELL_API_KEY || !process.env.VITE_RETELL_BASE_URL) {
      logger.error("Retell AI configuration missing");
      throw new ErrorResponse({
        code: ErrorCode.CONFIGURATION_ERROR,
        message: "Retell AI service not configured",
      });
    }
  }

  async getCampaigns() {
    try {
      const response = await this.client.campaigns.list();
      return response.data;
    } catch (error) {
      logger.error("Retell API error:", error);
      throw new ErrorResponse({
        code: ErrorCode.EXTERNAL_SERVICE_ERROR,
        message: "Failed to retrieve campaigns",
        originalError: error,
      });
    }
  }
}
