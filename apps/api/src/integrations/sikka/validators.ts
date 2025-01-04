import { Request, Response, NextFunction } from 'express';
import {
  InsuranceVerificationRequest,
  EligibilityRequest,
  BenefitsVerificationRequest,
  ClaimRequest
} from './types';

function createValidator<T>(validate: (data: any) => data is T) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (validate(req.body)) {
      next();
    } else {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
        }
      });
    }
  };
}

// Type guards for request validation
function isInsuranceVerificationRequest(data: any): data is InsuranceVerificationRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.patientId === 'string' &&
    typeof data.insuranceInfo === 'object' &&
    data.insuranceInfo !== null &&
    typeof data.insuranceInfo.carrierId === 'string' &&
    typeof data.insuranceInfo.memberId === 'string' &&
    (data.insuranceInfo.groupNumber === undefined || typeof data.insuranceInfo.groupNumber === 'string')
  );
}

function isEligibilityRequest(data: any): data is EligibilityRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.patientId === 'string' &&
    typeof data.serviceDate === 'string' &&
    Array.isArray(data.serviceTypes) &&
    data.serviceTypes.every((type: any) => typeof type === 'string')
  );
}

function isBenefitsVerificationRequest(data: any): data is BenefitsVerificationRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.patientId === 'string' &&
    Array.isArray(data.procedureCodes) &&
    data.procedureCodes.every((code: any) => typeof code === 'string') &&
    typeof data.serviceDate === 'string'
  );
}

function isClaimRequest(data: any): data is ClaimRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.patientId === 'string' &&
    typeof data.claimDetails === 'object' &&
    data.claimDetails !== null &&
    typeof data.claimDetails.serviceDate === 'string' &&
    Array.isArray(data.claimDetails.procedures) &&
    data.claimDetails.procedures.every((proc: any) =>
      typeof proc === 'object' &&
      proc !== null &&
      typeof proc.code === 'string' &&
      typeof proc.fee === 'number' &&
      Array.isArray(proc.diagnosis) &&
      proc.diagnosis.every((d: any) => typeof d === 'string')
    ) &&
    Array.isArray(data.claimDetails.diagnosisCodes) &&
    data.claimDetails.diagnosisCodes.every((code: any) => typeof code === 'string') &&
    typeof data.claimDetails.placeOfService === 'string'
  );
}

// Export middleware validators
export const validateInsuranceRequest = createValidator(isInsuranceVerificationRequest);
export const validateEligibilityRequest = createValidator(isEligibilityRequest);
export const validateBenefitsRequest = createValidator(isBenefitsVerificationRequest);
export const validateClaimRequest = createValidator(isClaimRequest);