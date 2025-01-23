export type SikkaVerifyInsuranceRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  insuranceId: string;
};

export type SikkaCheckEligibilityRequest = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    insuranceId: string;
  };

export type SikkaVerifyBenefitsRequest = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    insuranceId: string;
  };

export type SikkaProcessClaimRequest = {
    claimId: string;
  };