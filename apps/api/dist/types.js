import { AuditService } from './services/audit.service';
import { EncryptionService } from './services/encryption.service';
import { ComplianceService } from './services/compliance.service';
export class BaseAgent {
    async executeSecurely(task) {
        try {
            AuditService.logAccess(this.constructor.name);
            const result = await task();
            return await EncryptionService.encryptEntity(result, 'agent-operation');
        }
        catch (error) {
            ComplianceService.reportViolation({
                agent: this.constructor.name,
                error: error instanceof Error ? error : new Error(String(error))
            });
            throw error;
        }
    }
}
;
