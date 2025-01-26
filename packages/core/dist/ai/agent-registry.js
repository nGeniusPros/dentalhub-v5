import { AgentConfigSchema } from "./types";
export class AgentRegistry {
    constructor() {
        this.agents = new Map();
    }
    static getInstance() {
        if (!AgentRegistry.instance) {
            AgentRegistry.instance = new AgentRegistry();
        }
        return AgentRegistry.instance;
    }
    registerAgent(name, config) {
        const validatedConfig = AgentConfigSchema.parse(config);
        const agent = this.createAgentInstance(name, validatedConfig);
        this.agents.set(name, agent);
        return agent;
    }
    getAgent(name) {
        const agent = this.agents.get(name);
        if (!agent) {
            throw new Error(`Agent ${name} not registered`);
        }
        return agent;
    }
    createAgentInstance(name, config) {
        // Implementation will vary based on actual agent classes
        return {
            name,
            config,
            process: () => Promise.resolve("Not implemented"),
        };
    }
}
//# sourceMappingURL=agent-registry.js.map