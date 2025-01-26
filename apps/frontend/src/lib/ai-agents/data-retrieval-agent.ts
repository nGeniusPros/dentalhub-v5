import { BaseAgent } from "./base-agent";
import { RequestManager } from "./request-manager";
import { PracticeMetrics } from "./types/frontend-types";

export interface DataRetrievalResponse {
  data: any;
  error?: string;
}

export class DataRetrievalAgent extends BaseAgent {
  private requestManager: RequestManager;
  private metrics: PracticeMetrics;

  constructor(metrics: PracticeMetrics) {
    super("data-retrieval");
    this.requestManager = RequestManager.getInstance();
    this.metrics = metrics;
  }

  async processQuery(query: string): Promise<DataRetrievalResponse> {
    try {
      // For now, return mock data based on metrics
      return {
        data: {
          metrics: this.metrics,
          insights: [
            {
              type: "revenue",
              value: this.metrics.monthlyRevenue,
              trend: "increasing",
              recommendation: "Current revenue trends are positive",
            },
            {
              type: "patients",
              value: this.metrics.patientCount,
              trend: "stable",
              recommendation: "Patient retention is healthy",
            },
            {
              type: "appointments",
              value: this.metrics.appointmentRate,
              trend: "needs-improvement",
              recommendation: "Consider optimizing appointment scheduling",
            },
          ],
        },
      };
    } catch (error) {
      console.error("Data retrieval failed:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Data retrieval failed",
      };
    }
  }

  async getHistoricalData(): Promise<DataRetrievalResponse> {
    try {
      const response = await this.requestManager.get("/dashboard/stats");
      return { data: response };
    } catch (error) {
      console.error("Historical data retrieval failed:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Historical data retrieval failed",
      };
    }
  }
}
