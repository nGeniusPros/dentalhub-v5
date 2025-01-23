import { KPICalculationEngine } from './kpi.service';
import { ScheduleOptimizer } from './scheduler.service';
import { MetricsRepository } from './metrics.repository';
import { BaseAgent, AgentType } from '../types';
export declare class AgentFactory {
    private kpiEngine;
    private scheduler;
    private metricsRepo;
    private agents;
    constructor(kpiEngine: KPICalculationEngine, scheduler: ScheduleOptimizer, metricsRepo: MetricsRepository);
    createAgent<T extends BaseAgent>(type: AgentType): T;
    private instantiateAgent;
}
