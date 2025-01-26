import { openAIService } from "../../services/ai/openai.service";
import type { AssistantType } from "../../services/ai/openai.types";
import { DataRetrievalAgent } from "./data-retrieval-agent";
import { PracticeMetrics } from "./types/frontend-types";

export type AgentType =
  | "revenue"
  | "patient-care"
  | "operations"
  | "staff"
  | "head-brain"
  | "data-analysis"
  | "data-retrieval";

interface AgentMetadata {
  version: string;
  capabilities: string[];
  rateLimit?: {
    tokens: number;
    windowMs: number;
  };
}

export interface AIResponse {
  content: string;
  metadata?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}

export interface AIAgent {
  processQuery: (content: string) => Promise<AIResponse>;
}

export class AgentFactory {
  private static instance: AgentFactory;
  private metrics: PracticeMetrics;
  private agentMetadata = new Map<AgentType, AgentMetadata>();
  private rateLimiters = new Map<AgentType, TokenBucket>();
  private openAIService: typeof openAIService;

  private constructor() {
    this.metrics = {
      monthlyRevenue: 0,
      patientCount: 0,
      appointmentRate: 0,
      treatmentAcceptance: 0,
    };
    this.openAIService = openAIService;

    // Initialize agent metadata
    this.agentMetadata.set("revenue", {
      version: "2.1.0",
      capabilities: ["financial_analysis", "revenue_optimization"],
      rateLimit: { tokens: 10, windowMs: 60000 },
    });
    this.agentMetadata.set("patient-care", {
      version: "1.3.0",
      capabilities: ["patient_management", "care_coordination"],
    });
    this.agentMetadata.set("operations", {
      version: "1.8.0",
      capabilities: ["operational_optimization", "resource_scheduling"],
    });
    this.agentMetadata.set("staff", {
      version: "1.2.0",
      capabilities: ["staff_management", "training_coordination"],
    });
    this.agentMetadata.set("head-brain", {
      version: "1.0.0",
      capabilities: [
        "query_orchestration",
        "multi_agent_coordination",
        "response_aggregation",
        "data_validation",
      ],
    });
    this.agentMetadata.set("data-analysis", {
      version: "1.1.0",
      capabilities: ["data_analysis", "insight_generation"],
    });
    this.agentMetadata.set("data-retrieval", {
      version: "1.0.0",
      capabilities: ["data_retrieval", "data_validation"],
    });
  }

  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }

  public setMetrics(metrics: PracticeMetrics) {
    this.metrics = metrics;
  }

  public initializeAgents(): Map<AgentType, AIAgent> {
    const agents = new Map<AgentType, AIAgent>();

    // Initialize data retrieval agent
    const dataRetrievalAgent = new DataRetrievalAgent(this.metrics);
    agents.set("data-retrieval", {
      processQuery: async (content: string) => {
        const response = await dataRetrievalAgent.processQuery(content);
        return {
          content: JSON.stringify(response.data),
          error: response.error
            ? { code: "DATA_RETRIEVAL_ERROR", message: response.error }
            : undefined,
        };
      },
    });

    // Initialize other agents
    for (const type of this.agentMetadata.keys()) {
      if (type !== "data-retrieval") {
        agents.set(type, {
          processQuery: async (content: string) => {
            const assistantType = this.getAssistantType(type);
            return this.openAIService.generateResponse(content, {
              assistantType,
            });
          },
        });
      }
    }

    return agents;
  }

  private getAssistantType(type: AgentType): AssistantType {
    switch (type) {
      case "revenue":
        return "profitability";
      case "patient-care":
        return "patient-care";
      case "operations":
        return "operations";
      case "staff":
        return "staff-training";
      case "head-brain":
        return "brain-consultant";
      case "data-analysis":
        return "analysis";
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }

  private getRateLimiter(agentType: AgentType): TokenBucket {
    let limiter = this.rateLimiters.get(agentType);
    if (!limiter) {
      const metadata = this.agentMetadata.get(agentType);
      limiter = new TokenBucket({
        bucketSize: metadata?.rateLimit?.tokens || 10,
        tokensPerInterval: metadata?.rateLimit?.tokens || 10,
        interval: metadata?.rateLimit?.windowMs || 60000,
      });
      this.rateLimiters.set(agentType, limiter);
    }
    return limiter;
  }
}

class TokenBucket {
  private tokens: number;
  private lastFilled: number;

  constructor(
    private config: {
      bucketSize: number;
      tokensPerInterval: number;
      interval: number;
    },
  ) {
    this.tokens = config.bucketSize;
    this.lastFilled = Date.now();
  }

  tryRemoveTokens(count: number): boolean {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastFilled;
    const tokensToAdd = Math.floor(
      (timePassed / this.config.interval) * this.config.tokensPerInterval,
    );

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.config.bucketSize, this.tokens + tokensToAdd);
      this.lastFilled = now;
    }
  }
}
