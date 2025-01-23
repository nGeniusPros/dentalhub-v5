import type { AgentType, BaseAgent } from './types';
import { AgentFactory } from './services/agent.factory';
export declare class AgentContainer {
    private factory;
    private agents;
    constructor(factory: AgentFactory);
    register<T extends BaseAgent>(type: AgentType, provider: () => T): void;
    resolve<T extends BaseAgent>(type: AgentType): T;
}
