import { DentalAgentType, AgentConfig } from '../types/agent-types';
import { BaseAgent } from '../agents/base-agent';
import { DataRetrievalAgent } from '../agents/data-retrieval-agent';
import { ProfitabilityAppointmentAgent } from '../agents/profitability-appointment-agent';
import { HeadBrainConsultant } from '../agents/head-brain-consultant';

export class AgentFactory {
  private static instance: AgentFactory;
  private agents = new Map<DentalAgentType, BaseAgent>();
  private configs = new Map<DentalAgentType, AgentConfig>();

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
    this.configs.set('DATA_RETRIEVAL', {
      id: import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_ID,
      apiKey: import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_API_KEY,
      rateLimit: { rpm: 60, tpm: 150000 }
    });

    this.configs.set('PROFITABILITY_APPOINTMENT', {
      id: import.meta.env.VITE_OPENAI_PROFITABILITY_APPOINTMENT_ID,
      apiKey: import.meta.env.VITE_OPENAI_PROFITABILITY_APPOINTMENT_API_KEY,
      rateLimit: { rpm: 60, tpm: 150000 }
    });

    this.configs.set('BRAIN_CONSULTANT', {
      id: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID,
      apiKey: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_API_KEY,
      rateLimit: { rpm: 60, tpm: 150000 }
    });

    // Add other agent configs as needed
  }

  private initializeAgents() {
    // Initialize with specific agent implementations
    const dataRetrievalConfig = this.configs.get('DATA_RETRIEVAL');
    if (dataRetrievalConfig) {
      this.agents.set('DATA_RETRIEVAL', new DataRetrievalAgent(dataRetrievalConfig));
    }

    const profitabilityConfig = this.configs.get('PROFITABILITY_APPOINTMENT');
    if (profitabilityConfig) {
      this.agents.set('PROFITABILITY_APPOINTMENT', 
        new ProfitabilityAppointmentAgent(profitabilityConfig));
    }

    const brainConsultantConfig = this.configs.get('BRAIN_CONSULTANT');
    if (brainConsultantConfig) {
      this.agents.set('BRAIN_CONSULTANT', 
        new HeadBrainConsultant(brainConsultantConfig));
    }

    // Add other agent initializations
  }

  getAgent(type: DentalAgentType): BaseAgent {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent ${type} not configured`);
    }
    return agent;
  }

  getConfig(type: DentalAgentType): AgentConfig {
    const config = this.configs.get(type);
    if (!config) {
      throw new Error(`Configuration for ${type} not found`);
    }
    return config;
  }
}
