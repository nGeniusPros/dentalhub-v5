export interface SikkaVerifyInsuranceRequest {
    insuranceProvider: string;
    subscriberId: string;
    groupNumber?: string;
    patientInfo: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender?: "M" | "F" | "O";
        relationship?: "self" | "spouse" | "child" | "other";
    };
    subscriberInfo?: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender?: "M" | "F" | "O";
    };
}
export interface SikkaCheckEligibilityRequest {
    insuranceId: string;
    patientId: string;
    serviceDate: string;
    services?: Array<{
        code: string;
        type?: string;
        quantity?: number;
    }>;
}
export interface SikkaVerifyBenefitsRequest {
    insuranceId: string;
    patientId: string;
    benefitYear?: string;
    serviceTypes?: Array<"preventive" | "basic" | "major" | "orthodontic">;
}
export interface SikkaProcessClaimRequest {
    insuranceId: string;
    patientId: string;
    providerId: string;
    claimInfo: {
        serviceDate: string;
        placeOfService: string;
        claimType: "primary" | "secondary" | "tertiary";
        procedures: Array<{
            code: string;
            description: string;
            fee: number;
            tooth?: string;
            surface?: string;
            quadrant?: string;
            date: string;
        }>;
        diagnosis?: Array<{
            code: string;
            description: string;
        }>;
        attachments?: Array<{
            type: string;
            content: string;
            filename: string;
        }>;
    };
    billingProvider?: {
        npi: string;
        taxId: string;
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
    };
}
export interface SikkaTreatmentPlanRequest {
    patientId: string;
    providerId: string;
    diagnosis: Array<{
        code: string;
        description: string;
        severity: "mild" | "moderate" | "severe";
    }>;
    procedures: Array<{
        code: string;
        description: string;
        priority: "high" | "medium" | "low";
        estimatedCost: number;
        tooth?: string;
        surface?: string;
        quadrant?: string;
    }>;
    timeline?: {
        startDate: string;
        endDate?: string;
        phases?: Array<{
            name: string;
            procedures: string[];
            duration: number;
        }>;
    };
    notes?: string;
}
export interface SikkaPreAuthorizationRequest {
    insuranceId: string;
    patientId: string;
    providerId: string;
    procedures: Array<{
        code: string;
        description: string;
        fee: number;
        tooth?: string;
        surface?: string;
        quadrant?: string;
        narrative?: string;
    }>;
    supportingDocuments?: Array<{
        type: string;
        content: string;
        filename: string;
    }>;
    urgency?: "routine" | "urgent" | "emergency";
    notes?: string;
}
//# sourceMappingURL=sikka-requests.d.ts.map