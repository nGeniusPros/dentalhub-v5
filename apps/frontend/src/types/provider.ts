export interface ProviderCredential {
  id: string;
  type: "license" | "dea" | "npi" | "tax" | "ssn" | "cpr" | "other";
  number: string;
  state?: string;
  issueDate: string;
  expirationDate: string;
  verificationDate?: string;
  verifiedBy?: string;
  status: "active" | "expired" | "pending";
  documentUrl?: string;
  notes?: string[];
}

export interface Provider {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    ssn: string;
    dateOfBirth: string;
  };
  credentials: {
    license: ProviderCredential[];
    dea: ProviderCredential[];
    npi: ProviderCredential[];
    taxId: string;
    cprCertification?: ProviderCredential;
    specialtyCertifications?: ProviderCredential[];
  };
  employmentDetails: {
    startDate: string;
    role: string;
    department: string;
    status: "active" | "inactive" | "on-leave";
  };
  insurance: {
    malpractice: {
      provider: string;
      policyNumber: string;
      coverage: number;
      expirationDate: string;
    };
    liability?: {
      provider: string;
      policyNumber: string;
      coverage: number;
      expirationDate: string;
    };
  };
  documents: {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadDate: string;
    expirationDate?: string;
  }[];
  notes: string[];
}
