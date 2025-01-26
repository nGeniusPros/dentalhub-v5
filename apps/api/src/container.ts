import type { AgentType, BaseAgent } from "./types";
import { AgentFactory } from "./services/agent.factory";

export class AgentContainer {
  private agents = new Map<AgentType, BaseAgent>();

  constructor(private factory: AgentFactory) {}

  register<T extends BaseAgent>(type: AgentType, provider: () => T) {
    this.agents.set(type, provider());
  }

  resolve<T extends BaseAgent>(type: AgentType): T {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent ${type} not registered`);
    }
    return agent as T;
  }
}
