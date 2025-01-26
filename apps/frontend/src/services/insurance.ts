import { apiRequest, endpoints, createEndpoint } from '../lib/api';
import { validate, insurancePlanSchema, insuranceSearchSchema } from '../utils/validation';
import { withErrorHandling } from '../utils/error-handling';
import type {
  InsurancePlan,
  InsuranceProvider,
  InsuranceCoverage,
  InsuranceClaim,
  InsuranceVerification
} from '../types/insurance';

class InsuranceService {
  private planEndpoint = createEndpoint<InsurancePlan>(endpoints.insurance.plans);
  private providerEndpoint = createEndpoint<InsuranceProvider>(endpoints.insurance.providers);
  private claimEndpoint = createEndpoint<InsuranceClaim>(endpoints.insurance.claims);

  getPlans = withErrorHandling(async (params?: {
    search?: string;
    provider?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ plans: InsurancePlan[]; total: number }> => {
    const validParams = validate(insuranceSearchSchema, params);
    return this.planEndpoint.get(validParams);
  }, 'InsuranceService.getPlans');

  getPlanById = withErrorHandling(async (id: string): Promise<InsurancePlan> => {
    return this.planEndpoint.getById(id);
  }, 'InsuranceService.getPlanById');

  createPlan = withErrorHandling(async (plan: Partial<InsurancePlan>): Promise<InsurancePlan> => {
    const validPlan = validate(insurancePlanSchema, plan);
    return this.planEndpoint.create(validPlan);
  }, 'InsuranceService.createPlan');

  updatePlan = withErrorHandling(async (
    id: string,
    updates: Partial<InsurancePlan>
  ): Promise<InsurancePlan> => {
    const validUpdates = validate(insurancePlanSchema.partial(), updates);
    return this.planEndpoint.update(id, validUpdates);
  }, 'InsuranceService.updatePlan');

  deletePlan = withErrorHandling(async (id: string): Promise<void> => {
    return this.planEndpoint.delete(id);
  }, 'InsuranceService.deletePlan');

  getProviders = withErrorHandling(async (): Promise<InsuranceProvider[]> => {
    return this.providerEndpoint.get();
  }, 'InsuranceService.getProviders');

  getCoverageByPlan = withErrorHandling(async (
    planId: string
  ): Promise<InsuranceCoverage[]> => {
    return apiRequest('get', `${endpoints.insurance.plans}/${planId}/coverage`);
  }, 'InsuranceService.getCoverageByPlan');

  updateCoverage = withErrorHandling(async (
    planId: string,
    coverage: Partial<InsuranceCoverage>[]
  ): Promise<InsuranceCoverage[]> => {
    return apiRequest('put', `${endpoints.insurance.plans}/${planId}/coverage`, coverage);
  }, 'InsuranceService.updateCoverage');

  verifyEligibility = withErrorHandling(async (
    planId: string,
    patientId: string
  ): Promise<InsuranceVerification> => {
    return apiRequest('post', endpoints.insurance.verify, { planId, patientId });
  }, 'InsuranceService.verifyEligibility');

  submitClaim = withErrorHandling(async (claim: {
    planId: string;
    patientId: string;
    providerId: string;
    procedures: Array<{
      code: string;
      date: string;
      fee: number;
      tooth?: string;
      surface?: string;
    }>;
  }): Promise<{ claimId: string; status: string }> => {
    return this.claimEndpoint.create(claim);
  }, 'InsuranceService.submitClaim');

  getClaimStatus = withErrorHandling(async (
    claimId: string
  ): Promise<{ status: string; details: Record<string, unknown> }> => {
    return apiRequest('get', `${endpoints.insurance.claims}/${claimId}/status`);
  }, 'InsuranceService.getClaimStatus');
}

export const insuranceService = new InsuranceService();
