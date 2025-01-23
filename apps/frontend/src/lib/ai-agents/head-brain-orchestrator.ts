import { AgentFactory, AgentType, AIAgent } from './agent-factory';
import { PracticeMetrics } from './types/frontend-types';

export class HeadBrainOrchestrator {
  private static instance: HeadBrainOrchestrator;
  private agents: Map<AgentType, AIAgent>;
  private agentFactory: AgentFactory;

  private constructor() {
    this.agentFactory = AgentFactory.getInstance();
    this.agents = new Map();
  }

  public static getInstance(): HeadBrainOrchestrator {
    if (!HeadBrainOrchestrator.instance) {
      HeadBrainOrchestrator.instance = new HeadBrainOrchestrator();
    }
    return HeadBrainOrchestrator.instance;
  }

  public initialize(metrics: PracticeMetrics) {
    this.agentFactory.setMetrics(metrics);
    this.agents = this.agentFactory.initializeAgents();
  }

  public async processQuery(content: string, agentType: AgentType = 'head-brain'): Promise<string> {
    try {
      const agent = this.agents.get(agentType);
      if (!agent) {
        throw new Error(`Agent ${agentType} not found`);
      }

      const response = await agent.processQuery(content);
      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.content;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }

  public getAgent(type: AgentType): AIAgent | undefined {
    return this.agents.get(type);
  }
}
