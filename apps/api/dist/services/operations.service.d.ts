import { MetricsRepository } from './metrics.repository';
import { KPICalculationEngine } from './kpi.service';
import { ScheduleOptimizer } from './scheduler.service';
export declare class OperationsAgent extends BaseAgent {
    private metricsRepo;
    private kpiEngine;
    private scheduler;
    type: "operations";
    constructor(metricsRepo: MetricsRepository, kpiEngine: KPICalculationEngine, scheduler: ScheduleOptimizer);
    analyzeEfficiency(): Promise<any>;
    optimizeSchedule(): Promise<any>;
}
