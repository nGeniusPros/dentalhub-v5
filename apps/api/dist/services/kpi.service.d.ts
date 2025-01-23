import { PracticeMetrics, OperationalKPIs } from '../../types';
import { MetricsRepository } from './metrics.repository';
import { AuditService } from './audit.service';
import { EncryptionService } from './encryption.service';
export declare class KPICalculationEngine {
    private metricsRepo;
    private encryptor;
    private auditor;
    constructor(metricsRepo: MetricsRepository, encryptor: EncryptionService, auditor: AuditService);
    calculateOperationalKPIs(metrics: PracticeMetrics): Promise<OperationalKPIs>;
    private calculateHourlyRate;
    private calculateHygieneTarget;
}
