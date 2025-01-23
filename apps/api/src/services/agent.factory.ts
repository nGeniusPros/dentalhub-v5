import { KPICalculationEngine } from './kpi.service';
import { ScheduleOptimizer } from './scheduler.service';
import { MetricsRepository } from './metrics.repository';
import { BaseAgent, AgentType } from '../types';

export class AgentFactory {
  private agents = new Map<AgentType, BaseAgent>();
  
  constructor(
    private kpiEngine: KPICalculationEngine,
    private scheduler: ScheduleOptimizer,
    private metricsRepo: MetricsRepository
  ) {}

  createAgent<T extends BaseAgent>(type: AgentType): T {
    if (!this.agents.has(type)) {
      this.agents.set(type, this.instantiateAgent(type));
    }
    return this.agents.get(type) as T;
  }

  private instantiateAgent(type: AgentType): BaseAgent {
    switch(type) {
      case 'operations':
        return new OperationsAgent(this.metricsRepo, this.kpiEngine, this.scheduler);
      // Add other agent types
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }
}