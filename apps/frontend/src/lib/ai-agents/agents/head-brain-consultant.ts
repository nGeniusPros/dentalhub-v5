import { AgentConfig, DentalAgentType, AIResponse, AgentMetadata } from "../types/agent-types";
import { AgentError } from "../types/errors";
import { RequestManager } from "../infrastructure/request-manager";
import { ResponseCache } from "../infrastructure/response-cache";
import { BaseAgent } from "./base-agent";
import { DataRetrievalAgent } from "./data-retrieval-agent";
import { ProfitabilityAppointmentAgent } from "./profitability-appointment-agent";
import { StaffOptimizationAgent } from "./staff-optimization-agent";
import { RecommendationAgent } from "./recommendation-agent";
import { PatientCareAgent } from "./patient-care-agent";
import { OperationsAgent } from "./operations-agent";
import { StaffTrainingAgent } from "./staff-training-agent";
import { LabCaseManagerAgent } from "./lab-case-manager-agent";
import { ProcedureCodeAgent } from "./procedure-code-agent";
import { SuppliesManagerAgent } from "./supplies-manager-agent";
import { MarketingROIAgent } from "./marketing-roi-agent";
import { HygieneAnalyticsAgent } from "./hygiene-analytics-agent";
import { PatientDemographicsAgent } from "./patient-demographics-agent";
import { OSHAComplianceAgent } from "./osha-compliance-agent";
import { InsuranceVerificationAgent } from "./insurance-verification-agent";
import { MarketingCoachingAgent } from "./marketing-coaching-agent";
import { RevenueHackAgent } from "./revenue-hack-agent";
import { DataAnalysisAgent } from "./data-analysis-agent";

interface ConsultationRequest {
  query: string;
  context?: {
    priority: "high" | "medium" | "low";
    timeframe: string;
    constraints: string[];
  };
  preferences?: {
    detailLevel: "basic" | "detailed" | "comprehensive";
    format: string[];
  };
}

interface AgentResponse {
  agentType: DentalAgentType;
  analysis: string;
  confidence: number;
  recommendations: string[];
  metadata: Record<string, any>;
}

interface ConsultationResponse {
  summary: string;
  recommendations: string[];
  prioritizedActions: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    impact: string;
    effort: string;
  }>;
  agentResponses: AgentResponse[];
}

export class HeadBrainConsultant extends BaseAgent {
  private readonly requestManager: RequestManager;
  private readonly responseCache: ResponseCache;
  private subAgents: Map<DentalAgentType, BaseAgent>;

  constructor(config: AgentConfig) {
    super(config);
    this.requestManager = RequestManager.getInstance();
    this.responseCache = ResponseCache.getInstance();
    this.subAgents = new Map();
    this.initializeSubAgents(config);
  }

  protected initializeMetadata(): AgentMetadata {
    return {
      capabilities: [
        {
          name: "practice_analysis",
          description: "Analyze practice performance and metrics",
          confidence: 0.9,
          parameters: {
            metrics: ["revenue", "patient_count", "appointment_fill_rate", "treatment_acceptance"],
          },
        },
        {
          name: "recommendations",
          description: "Generate actionable recommendations",
          confidence: 0.85,
          parameters: {
            categories: ["operations", "finance", "marketing", "staff"],
          },
        },
      ],
      specializations: [
        "practice management",
        "performance analysis",
        "strategic planning",
      ],
      constraints: [
        "requires practice metrics for accurate analysis",
        "recommendations based on available data",
      ],
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      supportedLanguages: ["en"],
    };
  }

  protected async generateResponse(message: string): Promise<AIResponse> {
    try {
      const request: ConsultationRequest = {
        query: message,
        context: {
          priority: "high",
          timeframe: "immediate",
          constraints: [],
        },
        preferences: {
          detailLevel: "comprehensive",
          format: ["text"],
        },
      };

      const response = await this.processQuery(request);

      return {
        content: response.summary,
        metadata: {
          recommendations: response.recommendations,
          prioritizedActions: response.prioritizedActions,
          agentResponses: response.agentResponses,
        },
        confidence: this.calculateConfidence(response.agentResponses),
      };
    } catch (error) {
      throw new AgentError(
        "Failed to generate brain consultant response",
        "HEAD_BRAIN_CONSULTANT",
        "PROCESSING_ERROR",
        true,
        error instanceof Error ? error : undefined,
      );
    }
  }

  private initializeSubAgents(config: AgentConfig) {
    this.subAgents.set("DATA_RETRIEVAL", new DataRetrievalAgent(config));
    this.subAgents.set(
      "PROFITABILITY_APPOINTMENT",
      new ProfitabilityAppointmentAgent(config),
    );
    this.subAgents.set(
      "STAFF_OPTIMIZATION",
      new StaffOptimizationAgent(config),
    );
    this.subAgents.set("RECOMMENDATION", new RecommendationAgent(config));
    this.subAgents.set("PATIENT_CARE", new PatientCareAgent(config));
    this.subAgents.set("OPERATIONS", new OperationsAgent(config));
    this.subAgents.set("STAFF_TRAINING", new StaffTrainingAgent(config));
    this.subAgents.set("LAB_CASE_MANAGER", new LabCaseManagerAgent(config));
    this.subAgents.set("PROCEDURE_CODE", new ProcedureCodeAgent(config));
    this.subAgents.set("SUPPLIES_MANAGER", new SuppliesManagerAgent(config));
    this.subAgents.set("MARKETING_ROI", new MarketingROIAgent(config));
    this.subAgents.set("HYGIENE_ANALYTICS", new HygieneAnalyticsAgent(config));
    this.subAgents.set(
      "PATIENT_DEMOGRAPHICS",
      new PatientDemographicsAgent(config),
    );
    this.subAgents.set("OSHA_COMPLIANCE", new OSHAComplianceAgent(config));
    this.subAgents.set(
      "INSURANCE_VERIFICATION",
      new InsuranceVerificationAgent(config),
    );
    this.subAgents.set(
      "MARKETING_COACHING",
      new MarketingCoachingAgent(config),
    );
    this.subAgents.set("REVENUE_HACK", new RevenueHackAgent(config));
    this.subAgents.set("DATA_ANALYSIS", new DataAnalysisAgent(config));
  }

  private async processQuery(
    request: ConsultationRequest,
  ): Promise<ConsultationResponse> {
    try {
      // 1. Determine relevant agents for the query
      const relevantAgents = await this.determineRelevantAgents(request);

      // 2. Query each relevant agent and pass context
      const agentResponses = await Promise.all(
        relevantAgents.map((agentType) => {
          const agent = this.subAgents.get(agentType);
          if (agent) {
            agent.setContext(this.context);
            return this.queryAgent(agent, request);
          }
          return null;
        }).filter((response): response is Promise<AgentResponse> => response !== null),
      );

      // 3. Synthesize responses
      const synthesis = await this.synthesizeResponses(request, agentResponses);

      return {
        summary: synthesis.summary,
        recommendations: synthesis.recommendations,
        prioritizedActions: synthesis.actions,
        agentResponses,
      };
    } catch (error) {
      throw new AgentError(
        "Failed to process consultation request",
        "HEAD_BRAIN_CONSULTANT",
        "PROCESSING_ERROR",
        true,
        error instanceof Error ? error : undefined,
      );
    }
  }

  private async determineRelevantAgents(
    request: ConsultationRequest,
  ): Promise<DentalAgentType[]> {
    return this.rateLimitRequest(async () => {
      const analysis = await this.requestManager.createAssistantMessage(
        this.config.assistantId || "",
        {
          role: "user",
          content: JSON.stringify({
            query: request.query,
            context: {
              ...request.context,
              practiceMetrics: this.context.practiceMetrics,
            },
            preferences: request.preferences,
            availableAgents: Array.from(this.subAgents.keys()),
          }),
        },
      );

      try {
        const relevantAgents = JSON.parse(analysis.content);
        return relevantAgents.filter((agent: string) =>
          this.subAgents.has(agent as DentalAgentType),
        ) as DentalAgentType[];
      } catch (error) {
        console.error("Failed to parse relevant agents:", error);
        return ["DATA_RETRIEVAL", "RECOMMENDATION"] as DentalAgentType[];
      }
    });
  }

  private async queryAgent(
    agent: BaseAgent,
    request: ConsultationRequest,
  ): Promise<AgentResponse> {
    const cacheKey = `${agent.constructor.name}_${request.query}_${JSON.stringify(this.context)}`;
    
    if (this.config.caching?.enabled) {
      const cachedResponse = await this.responseCache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse as AgentResponse;
      }
    }

    const response = await agent.processMessage(request.query);
    const agentResponse = {
      agentType: agent.constructor.name as DentalAgentType,
      analysis: response.content,
      confidence: response.confidence || 0.8,
      recommendations: response.metadata?.recommendations || [],
      metadata: response.metadata || {},
    };

    if (this.config.caching?.enabled) {
      await this.responseCache.set(cacheKey, agentResponse, this.config.caching.ttl);
    }
    
    return agentResponse;
  }

  private async synthesizeResponses(
    request: ConsultationRequest,
    responses: AgentResponse[],
  ): Promise<{
    summary: string;
    recommendations: string[];
    actions: Array<{
      action: string;
      priority: "high" | "medium" | "low";
      impact: string;
      effort: string;
    }>;
  }> {
    return this.rateLimitRequest(async () => {
      const synthesis = await this.requestManager.createAssistantMessage(
        this.config.assistantId || "",
        {
          role: "user",
          content: JSON.stringify({
            query: request.query,
            context: {
              ...request.context,
              practiceMetrics: this.context.practiceMetrics,
            },
            responses: responses,
          }),
        },
      );

      try {
        return JSON.parse(synthesis.content);
      } catch (error) {
        console.error("Failed to parse synthesis:", error);
        return {
          summary: "Failed to synthesize responses",
          recommendations: [],
          actions: [],
        };
      }
    });
  }

  private calculateConfidence(responses: AgentResponse[]): number {
    if (responses.length === 0) return 0;
    const totalConfidence = responses.reduce((sum, response) => sum + response.confidence, 0);
    return totalConfidence / responses.length;
  }
}
