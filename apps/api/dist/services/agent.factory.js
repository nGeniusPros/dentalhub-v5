export class AgentFactory {
    constructor(kpiEngine, scheduler, metricsRepo) {
        this.kpiEngine = kpiEngine;
        this.scheduler = scheduler;
        this.metricsRepo = metricsRepo;
        this.agents = new Map();
    }
    createAgent(type) {
        if (!this.agents.has(type)) {
            this.agents.set(type, this.instantiateAgent(type));
        }
        return this.agents.get(type);
    }
    instantiateAgent(type) {
        switch (type) {
            case 'operations':
                return new OperationsAgent(this.metricsRepo, this.kpiEngine, this.scheduler);
            // Add other agent types
            default:
                throw new Error(`Unknown agent type: ${type}`);
        }
    }
}
