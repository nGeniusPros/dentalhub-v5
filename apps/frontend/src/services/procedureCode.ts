import { apiRequest, endpoints, createEndpoint } from '../lib/api';
import { validate, procedureCodeSchema, procedureSearchSchema } from '../utils/validation';
import { withErrorHandling } from '../utils/error-handling';
import type {
  ProcedureCode,
  ProcedureCategory,
  ProcedureFee
} from '../types/procedures';

class ProcedureCodeService {
  private codeEndpoint = createEndpoint<ProcedureCode>(endpoints.procedures.codes);
  private categoryEndpoint = createEndpoint<ProcedureCategory>(endpoints.procedures.categories);
  private feeEndpoint = createEndpoint<ProcedureFee>(endpoints.procedures.fees);

  getProcedureCodes = withErrorHandling(async (params?: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ codes: ProcedureCode[]; total: number }> => {
    const validParams = validate(procedureSearchSchema, params);
    return this.codeEndpoint.get(validParams);
  }, 'ProcedureCodeService.getProcedureCodes');

  getProcedureCodeById = withErrorHandling(async (id: string): Promise<ProcedureCode> => {
    return this.codeEndpoint.getById(id);
  }, 'ProcedureCodeService.getProcedureCodeById');

  createProcedureCode = withErrorHandling(async (code: Partial<ProcedureCode>): Promise<ProcedureCode> => {
    const validCode = validate(procedureCodeSchema, code);
    return this.codeEndpoint.create(validCode);
  }, 'ProcedureCodeService.createProcedureCode');

  updateProcedureCode = withErrorHandling(async (
    id: string,
    updates: Partial<ProcedureCode>
  ): Promise<ProcedureCode> => {
    const validUpdates = validate(procedureCodeSchema.partial(), updates);
    return this.codeEndpoint.update(id, validUpdates);
  }, 'ProcedureCodeService.updateProcedureCode');

  deleteProcedureCode = withErrorHandling(async (id: string): Promise<void> => {
    return this.codeEndpoint.delete(id);
  }, 'ProcedureCodeService.deleteProcedureCode');

  getCategories = withErrorHandling(async (): Promise<ProcedureCategory[]> => {
    return this.categoryEndpoint.get();
  }, 'ProcedureCodeService.getCategories');

  getFeeSchedule = withErrorHandling(async (params?: {
    provider?: string;
    insurance?: string;
    effectiveDate?: string;
  }): Promise<ProcedureFee[]> => {
    return this.feeEndpoint.get(params);
  }, 'ProcedureCodeService.getFeeSchedule');

  updateFeeSchedule = withErrorHandling(async (fees: ProcedureFee[]): Promise<ProcedureFee[]> => {
    return this.feeEndpoint.create(fees);
  }, 'ProcedureCodeService.updateFeeSchedule');

  importCodes = withErrorHandling(async (file: File): Promise<{
    imported: number;
    updated: number;
    errors: Array<{ code: string; error: string }>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('post', endpoints.procedures.import, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, 'ProcedureCodeService.importCodes');

  exportCodes = withErrorHandling(async (params?: {
    category?: string;
    format?: 'csv' | 'excel';
  }): Promise<Blob> => {
    return apiRequest('get', endpoints.procedures.export, undefined, {
      params,
      responseType: 'blob',
    });
  }, 'ProcedureCodeService.exportCodes');

  validateCode = withErrorHandling(async (code: string): Promise<{
    valid: boolean;
    message?: string;
    suggestions?: string[];
  }> => {
    return apiRequest('post', endpoints.procedures.validate, { code });
  }, 'ProcedureCodeService.validateCode');
}

export const procedureCodeService = new ProcedureCodeService();
