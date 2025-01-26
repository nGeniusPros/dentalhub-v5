import { MetricsRepository } from "./metrics.repository";
import { KPICalculationEngine } from "./kpi.service";
import { ScheduleOptimizer } from "./scheduler.service";
import { trackPerformance } from "../decorators/performance.decorator";

export class OperationsAgent extends BaseAgent {
  type = "operations" as const;
  constructor(
    private metricsRepo: MetricsRepository,
    private kpiEngine: KPICalculationEngine,
    private scheduler: ScheduleOptimizer,
  ) {
    super();
  }

  @trackPerformance
  async analyzeEfficiency() {
    const metrics = await this.metricsRepo.getCurrentMetrics();
    const kpis = await this.kpiEngine.calculateOperationalKPIs(metrics);
    return this.scheduler.optimize(kpis);
  }

  async optimizeSchedule() {
    const metrics = await this.metricsRepo.getCurrentMetrics();
    const kpis = await this.kpiEngine.calculateOperationalKPIs(metrics);
    return this.scheduler.generateRecommendations(kpis);
  }
}
