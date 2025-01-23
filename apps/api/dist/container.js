export class AgentContainer {
    constructor(factory) {
        this.factory = factory;
        this.agents = new Map();
    }
    register(type, provider) {
        this.agents.set(type, provider());
    }
    resolve(type) {
        const agent = this.agents.get(type);
        if (!agent) {
            throw new Error(`Agent ${type} not registered`);
        }
        return agent;
    }
}
