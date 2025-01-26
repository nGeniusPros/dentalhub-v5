export interface ProcedureCode {
  id: string;
  code: string;
  description: string;
  longDescription?: string;
  category: ProcedureCategory;
  type: 'diagnostic' | 'preventive' | 'restorative' | 'endodontics' | 'periodontics' | 'prosthodontics' | 'oral-surgery' | 'orthodontics';
  status: 'active' | 'inactive' | 'deprecated';
  requiresTooth: boolean;
  requiresSurface: boolean;
  requiresQuadrant: boolean;
  defaultFee: number;
  ucr: number; // Usual, Customary, and Reasonable fee
  metadata: {
    ada?: string; // American Dental Association code
    icd?: string[]; // International Classification of Diseases codes
    cdt?: string; // Current Dental Terminology code
    modifiers?: string[];
    aliases?: string[];
    tags?: string[];
  };
  limitations?: {
    age?: {
      min?: number;
      max?: number;
    };
    frequency?: {
      type: 'days' | 'months' | 'years';
      value: number;
      perLifetime?: boolean;
      perProvider?: boolean;
    }[];
    arch?: 'upper' | 'lower' | 'both';
    quadrant?: string[];
    tooth?: string[];
    surface?: string[];
  };
  contraindications?: string[];
  prerequisites?: string[];
  documentation?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  order: number;
  status: 'active' | 'inactive';
  metadata?: {
    icon?: string;
    color?: string;
    tags?: string[];
  };
}

export interface ProcedureFee {
  id: string;
  procedureCode: string;
  provider?: string;
  insurance?: string;
  fee: number;
  ucr: number;
  copay?: number;
  effectiveDate: string;
  expirationDate?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureHistory {
  id: string;
  procedureCode: string;
  patientId: string;
  providerId: string;
  date: string;
  tooth?: string;
  surface?: string;
  quadrant?: string;
  diagnosis?: string[];
  notes?: string;
  fee: number;
  insurance?: {
    planId: string;
    coverage: number;
    copay: number;
    deductible: number;
    claimId?: string;
  };
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureTemplate {
  id: string;
  name: string;
  description?: string;
  procedures: Array<{
    code: string;
    order: number;
    defaultTooth?: string;
    defaultSurface?: string;
    defaultQuadrant?: string;
    notes?: string;
  }>;
  category?: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureModifier {
  id: string;
  code: string;
  description: string;
  affectsPrice: boolean;
  priceModifier?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
