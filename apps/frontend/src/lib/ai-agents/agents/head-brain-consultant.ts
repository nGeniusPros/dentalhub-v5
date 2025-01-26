import { AgentConfig, DentalAgentType } from "../types/agent-types";
import { AgentError } from "../types/errors";
import { RequestManager } from "../infrastructure/request-manager";
import { ResponseCache } from "../infrastructure/response-cache";
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

export class HeadBrainConsultant {
  private readonly requestManager: RequestManager;
  private readonly responseCache: ResponseCache;
  private subAgents: Map<DentalAgentType, any>;

  constructor(private readonly config: AgentConfig) {
    this.requestManager = RequestManager.getInstance();
    this.responseCache = ResponseCache.getInstance();
    this.subAgents = new Map();
    this.initializeSubAgents(config);
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

  async processQuery(
    request: ConsultationRequest,
  ): Promise<ConsultationResponse> {
    try {
      // 1. Determine relevant agents for the query
      const relevantAgents = await this.determineRelevantAgents(request);

      // 2. Query each relevant agent
      const agentResponses = await Promise.all(
        relevantAgents.map((agentType) =>
          this.queryAgent(this.subAgents.get(agentType), request),
        ),
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
    return this.requestManager.executeWithRateLimit(
      "HEAD_BRAIN_CONSULTANT",
      async () => {
        const assistantId = import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID;

        const analysis = await this.requestManager.createAssistantMessage(
          assistantId,
          {
            role: "user",
            content: JSON.stringify({
              query: request.query,
              context: request.context,
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
      },
    );
  }

  private async queryAgent(
    agent: any,
    request: ConsultationRequest,
  ): Promise<AgentResponse> {
    const cacheKey = `${agent.type}_${request.query}`;
    const cachedResponse = await this.responseCache.get(cacheKey);

    if (cachedResponse) {
      return cachedResponse as AgentResponse;
    }

    const response = await agent.processQuery(request.query);
    const agentResponse = {
      agentType: agent.type,
      analysis: response.content,
      confidence: response.confidence || 0.8,
      recommendations: response.recommendations || [],
      metadata: response.metadata || {},
    };

    await this.responseCache.set(cacheKey, agentResponse, 3600); // Cache for 1 hour
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
    return this.requestManager.executeWithRateLimit(
      "HEAD_BRAIN_CONSULTANT",
      async () => {
        const assistantId = import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID;

        const synthesis = await this.requestManager.createAssistantMessage(
          assistantId,
          {
            role: "user",
            content: JSON.stringify({
              query: request.query,
              context: request.context,
              preferences: request.preferences,
              agentResponses: responses,
            }),
          },
        );

        try {
          const result = JSON.parse(synthesis.content);
          return {
            summary: result.summary || "",
            recommendations: result.recommendations || [],
            actions: result.actions || [],
          };
        } catch (error) {
          console.error("Failed to parse synthesis:", error);
          return {
            summary: "Failed to synthesize responses",
            recommendations: [],
            actions: [],
          };
        }
      },
    );
  }
}
