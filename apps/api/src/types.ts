import { AuditService } from './services/audit.service';
import { EncryptionService } from './services/encryption.service';
import { ComplianceService } from './services/compliance.service';

export interface User {
  id: string;
  email: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  salutation: string | null;
  phone_number: string | null;
}

export type AgentType = 
  | 'operations'
  | 'revenue'
  | 'patient-care'
  | 'compliance';

export abstract class BaseAgent {
  abstract type: string;
  
  protected async executeSecurely<T>(task: () => Promise<T>): Promise<T> {
    try {
      AuditService.logAccess(this.constructor.name);
      const result = await task();
      return await EncryptionService.encryptEntity(result, 'agent-operation');
    } catch (error) {
      ComplianceService.reportViolation({
        agent: this.constructor.name,
        error: error instanceof Error ? error : new Error(String(error))
      });
      throw error;
    }
  }
}

export interface PracticeMetrics {
  treatmentAcceptanceRate: number;
  productionHours: number;
  hygieneProduction: number;
  treatmentPresentations: number;
  treatmentAcceptances: number;
}

export interface OperationalKPIs {
  hourlyOperatoryRate: number;
  dailyHygieneTarget: number;
  treatmentAcceptance: number;
  collectionsRatio?: number;
  patientSatisfaction?: number;
}

// Define missing types directly
export type UserRole = 'admin' | 'provider' | 'staff' | 'assistant';
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
};
export type { ProcedureCategoryMapping } from '@prisma/client';