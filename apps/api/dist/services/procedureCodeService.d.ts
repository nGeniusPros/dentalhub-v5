import type { SikkaProcedureCodeData } from '../types/api';
/**
 * Syncs procedure codes from Sikka API to our database
 */
export declare function syncProcedureCodes(sikkaProcedureCodes: SikkaProcedureCodeData[], practiceId: number): Promise<void>;
/**
    * Updates fee schedule for a procedure code
    */
export declare function updateProcedureCodeFee(practiceId: number, procedureCode: string, feeAmount: number, effectiveDate: Date): Promise<void>;
/**
    * Gets all active procedure codes for a practice with their current fees
    */
export declare function getPracticeProcedureCodes(practiceId: number): Promise<any>;
