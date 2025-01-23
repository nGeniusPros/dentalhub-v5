import { AgentConfig, AgentConfigSchema } from './types';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, any>;

  private constructor() {
    this.agents = new Map();
  }

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  registerAgent(name: string, config: Partial<AgentConfig>) {
    const validatedConfig = AgentConfigSchema.parse(config);
    const agent = this.createAgentInstance(name, validatedConfig);
    this.agents.set(name, agent);
    return agent;
  }

  getAgent(name: string) {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not registered`);
    }
    return agent;
  }

  private createAgentInstance(name: string, config: AgentConfig) {
    // Implementation will vary based on actual agent classes
    return {
      name,
      config,
      process: () => Promise.resolve('Not implemented')
    };
  }
}