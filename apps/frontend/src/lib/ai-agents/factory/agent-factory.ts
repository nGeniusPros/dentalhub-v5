import { DentalAgentType, AgentConfig, AgentContext } from "../types/agent-types";
import { BaseAgent } from "../agents/base-agent";
import { DataRetrievalAgent } from "../agents/data-retrieval-agent";
import { ProfitabilityAppointmentAgent } from "../agents/profitability-appointment-agent";
import { HeadBrainConsultant } from "../agents/head-brain-consultant";

export class AgentFactory {
  private static instance: AgentFactory;
  private agents = new Map<DentalAgentType, BaseAgent>();
  private configs = new Map<DentalAgentType, AgentConfig>();
  private context: AgentContext = {
    sessionData: {
      startTime: new Date().toISOString(),
      interactions: 0,
      lastInteraction: new Date().toISOString(),
    }
  };

  private constructor() {
    this.initializeConfigs();
    this.initializeAgents();
  }

  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }

  private initializeConfigs() {
    // Initialize configurations from environment variables
    this.configs.set("DATA_RETRIEVAL", {
      id: import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_ID,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      assistantId: import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_ASSISTANT_ID,
      model: "gpt-4-1106-preview",
      temperature: 0.7,
      maxTokens: 2000,
      rateLimit: { rpm: 60, tpm: 150000 },
      caching: {
        enabled: true,
        ttl: 3600 // 1 hour
      }
    });

    this.configs.set("PROFITABILITY_APPOINTMENT", {
      id: import.meta.env.VITE_OPENAI_PROFITABILITY_APPOINTMENT_ID,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      assistantId: import.meta.env.VITE_OPENAI_PROFITABILITY_ASSISTANT_ID,
      model: "gpt-4-1106-preview",
      temperature: 0.7,
      maxTokens: 2000,
      rateLimit: { rpm: 60, tpm: 150000 },
      caching: {
        enabled: true,
        ttl: 1800 // 30 minutes
      }
    });

    this.configs.set("BRAIN_CONSULTANT", {
      id: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      assistantId: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ASSISTANT_ID,
      model: "gpt-4-1106-preview",
      temperature: 0.8,
      maxTokens: 4000,
      rateLimit: { rpm: 60, tpm: 150000 },
      caching: {
        enabled: true,
        ttl: 1800 // 30 minutes
      }
    });
  }

  private initializeAgents() {
    // Initialize with specific agent implementations
    const dataRetrievalConfig = this.configs.get("DATA_RETRIEVAL");
    if (dataRetrievalConfig) {
      this.agents.set(
        "DATA_RETRIEVAL",
        new DataRetrievalAgent(dataRetrievalConfig)
      );
    }

    const profitabilityConfig = this.configs.get("PROFITABILITY_APPOINTMENT");
    if (profitabilityConfig) {
      this.agents.set(
        "PROFITABILITY_APPOINTMENT",
        new ProfitabilityAppointmentAgent(profitabilityConfig)
      );
    }

    const brainConsultantConfig = this.configs.get("BRAIN_CONSULTANT");
    if (brainConsultantConfig) {
      this.agents.set(
        "BRAIN_CONSULTANT",
        new HeadBrainConsultant(brainConsultantConfig)
      );
    }
  }

  public updateContext(newContext: Partial<AgentContext>) {
    this.context = {
      ...this.context,
      ...newContext,
      sessionData: {
        ...this.context.sessionData,
        interactions: (this.context.sessionData?.interactions || 0) + 1,
        lastInteraction: new Date().toISOString()
      }
    };
  }

  public getAgent(type: DentalAgentType): BaseAgent {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent ${type} not configured`);
    }
    agent.setContext(this.context);
    return agent;
  }

  public getConfig(type: DentalAgentType): AgentConfig {
    const config = this.configs.get(type);
    if (!config) {
      throw new Error(`Configuration for ${type} not found`);
    }
    return config;
  }

  public getContext(): AgentContext {
    return this.context;
  }
}
