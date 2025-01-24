import { type Patient } from '@dentalhub/database';
import { AuditService } from '@dentalhub/core';
import type { PatientRepository } from './repositories';
export declare class PatientService {
    private readonly repository;
    private readonly audit;
    constructor(repository: PatientRepository, audit: AuditService);
    createPatient(params: unknown): Promise<Patient>;
}
