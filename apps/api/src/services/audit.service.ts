export class AuditService {
  static logAccess(agentName: string) {
    console.log(`Access logged for agent: ${agentName}`);
  }

  static logSecurityEvent(type: string, details: Record<string, unknown>) {
    console.log(`Security event: ${type}`, details);
  }

  static logStorageEvent(action: string, entity: string) {
    console.log(`Storage ${action} for ${entity}`);
  }
}
