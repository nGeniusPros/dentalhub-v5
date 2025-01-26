import { ISO8601String, UUID } from "./common.js";
export type DocumentFormat = "pdf" | "docx";
export interface DocumentTemplate {
    id: UUID;
    name: string;
    type: string;
    version: string;
    content: string;
    variables: string[];
    created_at: ISO8601String;
    updated_at: ISO8601String;
}
export interface DocumentStorageOptions {
    path: string;
}
export interface DocumentGenerationOptions {
    outputFormat?: DocumentFormat;
    template?: string;
    storage?: DocumentStorageOptions;
}
export interface DocumentData {
    type: string;
    templateId: UUID;
    data: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
export interface GeneratedDocument {
    documentId: UUID;
    url: string;
    type: string;
    format: DocumentFormat;
    size: number;
    created_at: ISO8601String;
    metadata?: Record<string, unknown>;
}
export interface DocumentGenerationResult {
    success: boolean;
    document?: GeneratedDocument;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}
//# sourceMappingURL=document.d.ts.map