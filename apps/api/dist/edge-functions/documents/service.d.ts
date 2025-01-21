import { DocumentData, DocumentGenerationOptions, DocumentGenerationResult, DocumentTemplate } from './types';
export declare function generateDocument(data: DocumentData, options: DocumentGenerationOptions): Promise<DocumentGenerationResult>;
export declare function getDocumentTemplate(templateId: string): Promise<DocumentTemplate>;
