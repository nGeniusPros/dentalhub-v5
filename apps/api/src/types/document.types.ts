export interface DocumentData {
  type: string;
  templateId: string;
  data: any;
  metadata?: any;
}

export interface DocumentGenerationOptions {
  config?: {
    outputFormat?: "pdf" | "docx";
    template?: string;
  };
  storage?: DocumentStorageOptions;
}

export interface DocumentStorageOptions {
  path: string;
}

export interface GeneratedDocument {
  documentId: string;
  url: string;
  type: string;
  format: string;
  size: number;
  createdAt: string;
  metadata?: any;
}

export interface DocumentGenerationResult {
  success: boolean;
  document?: GeneratedDocument;
  error?: any;
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
