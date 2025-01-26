import { ISO8601String, UUID, Timestamps } from './common.js';

export interface PatientContact {
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PatientInsurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  primaryHolder: boolean;
  coverage: {
    type: string;
    percentage: number;
  };
}

export interface PatientMedicalHistory {
  conditions: string[];
  allergies: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  lastUpdate: ISO8601String;
}

export interface Patient extends Timestamps {
  id: UUID;
  practiceId: UUID;
  firstName: string;
  lastName: string;
  dateOfBirth: ISO8601String;
  gender: 'male' | 'female' | 'other';
  contact: PatientContact;
  insurance: PatientInsurance[];
  medicalHistory: PatientMedicalHistory;
  status: 'active' | 'inactive';
  notes?: string;
}
