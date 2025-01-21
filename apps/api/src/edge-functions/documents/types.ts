export interface DocumentGenerationConfig {
  template: string;
  outputFormat: 'pdf' | 'docx';
  paperSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface DocumentData {
  type: 'invoice' | 'receipt' | 'treatment_plan' | 'prescription' | 'referral';
  templateId: string;
  data: Record<string, any>;
  metadata?: {
    patientId: string;
    providerId: string;
    createdAt: string;
    documentId?: string;
  };
}

export interface GeneratedDocument {
  documentId: string;
  url: string;
  type: string;
  format: string;
  size: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  version: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentGenerationError {
  code: string;
  message: string;
  details?: any;
}

export interface DocumentGenerationResult {
  success: boolean;
  document?: GeneratedDocument;
  error?: DocumentGenerationError;
}

export interface DocumentStorageOptions {
  bucket: string;
  path: string;
  acl?: 'private' | 'public-read';
  metadata?: Record<string, string>;
  expiresIn?: number;
}

export interface DocumentGenerationOptions {
  priority?: 'high' | 'normal' | 'low';
  webhook?: {
    url: string;
    secret: string;
  };
  storage?: DocumentStorageOptions;
  config?: DocumentGenerationConfig;
}