export interface User {
    id: string;
    email: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    salutation: string | null;
    phone_number: string | null;
}
export type AgentType = 'operations' | 'revenue' | 'patient-care' | 'compliance';
export declare abstract class BaseAgent {
    abstract type: string;
    protected executeSecurely<T>(task: () => Promise<T>): Promise<T>;
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
export type UserRole = 'admin' | 'provider' | 'staff' | 'assistant';
export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
}
export type { ProcedureCategoryMapping } from '@prisma/client';
