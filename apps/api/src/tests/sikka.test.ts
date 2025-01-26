import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  verifyInsurance,
  checkEligibility,
  verifyBenefits,
  processClaim,
} from "../integrations/sikka/service";
import { sikkaConfig } from "../integrations/sikka/config";
import { SikkaIntegrationError } from "../integrations/sikka/error";

jest.mock("../integrations/sikka/token-service", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue("mock-request-key"),
      refreshToken: jest.fn().mockResolvedValue({
        requestKey: "mock-request-key",
        expiresAt: new Date(Date.now() + 3600000),
        scope: ["all"],
      }),
    })),
  };
});

describe("Sikka Integration", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
    jest.clearAllMocks();
  });

  describe("verifyInsurance", () => {
    const mockData = {
      patientId: "patient-id-1",
      insuranceInfo: {
        carrierId: "carrier-id-1",
        memberId: "member-id-1",
      },
    };

    it("should verify insurance successfully", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/insurance/verify`).reply(200, {
        verified: true,
        verification_details: { status: "active" },
        timestamp: new Date().toISOString(),
      });

      const result = await verifyInsurance(mockData);
      expect(result.verified).toBe(true);
      expect(result.details).toBeDefined();
    });

    it("should handle verification failure", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/insurance/verify`).reply(400, {
        error: {
          code: "INVALID_MEMBER_ID",
          message: "Invalid member ID provided",
        },
      });

      await expect(verifyInsurance(mockData)).rejects.toThrow(
        SikkaIntegrationError,
      );
    });
  });

  describe("checkEligibility", () => {
    const mockData = {
      patientId: "patient-id-1",
      serviceDate: "2024-03-15",
      serviceTypes: ["cleaning", "exam"],
    };

    it("should check eligibility successfully", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/eligibility/check`).reply(200, {
        eligible: true,
        coverage_details: { plan: "dental-plus" },
        limitations: [],
        timestamp: new Date().toISOString(),
      });

      const result = await checkEligibility(mockData);
      expect(result.eligible).toBe(true);
      expect(result.coverageDetails).toBeDefined();
    });

    it("should handle eligibility check failure", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/eligibility/check`).reply(404, {
        error: {
          code: "PATIENT_NOT_FOUND",
          message: "Patient not found",
        },
      });

      await expect(checkEligibility(mockData)).rejects.toThrow(
        SikkaIntegrationError,
      );
    });
  });

  describe("verifyBenefits", () => {
    const mockData = {
      patientId: "patient-id-1",
      procedureCodes: ["D0150", "D1110"],
      serviceDate: "2024-03-15",
    };

    it("should verify benefits successfully", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/benefits/verify`).reply(200, {
        covered: true,
        benefits_details: { coverage: "80%" },
        limitations: [],
        deductibles: { remaining: 500 },
        timestamp: new Date().toISOString(),
      });

      const result = await verifyBenefits(mockData);
      expect(result.covered).toBe(true);
      expect(result.benefitsDetails).toBeDefined();
    });

    it("should handle benefits verification failure", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/benefits/verify`).reply(401, {
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or expired token",
        },
      });

      await expect(verifyBenefits(mockData)).rejects.toThrow(
        SikkaIntegrationError,
      );
    });
  });

  describe("processClaim", () => {
    const mockData = {
      patientId: "patient-id-1",
      claimDetails: {
        serviceDate: "2024-03-15",
        procedures: [
          { code: "D0150", fee: 50, diagnosis: ["K05.3"] },
          { code: "D1110", fee: 100, diagnosis: ["K05.3"] },
        ],
        diagnosisCodes: ["K05.3"],
        placeOfService: "office",
      },
    };

    it("should process a claim successfully", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/claims/submit`).reply(200, {
        claim_id: "claim-123",
        status: "submitted",
        acknowledgement: "received",
        timestamp: new Date().toISOString(),
      });

      const result = await processClaim(mockData);
      expect(result.claimId).toBe("claim-123");
      expect(result.status).toBe("submitted");
    });

    it("should handle claim submission failure", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/claims/submit`).reply(422, {
        error: {
          code: "INVALID_PROCEDURE_CODE",
          message: "Invalid procedure code provided",
        },
      });

      await expect(processClaim(mockData)).rejects.toThrow(
        SikkaIntegrationError,
      );
    });

    it("should handle network errors", async () => {
      mockAxios.onPost(`${sikkaConfig.baseUrl}/claims/submit`).networkError();

      await expect(processClaim(mockData)).rejects.toThrow(
        SikkaIntegrationError,
      );
    });
  });
});
