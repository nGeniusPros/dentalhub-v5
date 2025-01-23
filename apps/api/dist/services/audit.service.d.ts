export declare class AuditService {
    static logAccess(agentName: string): void;
    static logSecurityEvent(type: string, details: Record<string, unknown>): void;
    static logStorageEvent(action: string, entity: string): void;
}
