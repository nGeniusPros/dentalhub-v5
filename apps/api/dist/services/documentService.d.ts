import { DocumentData, DocumentGenerationOptions, DocumentGenerationResult, DocumentTemplate } from '../types/document.types';
export declare class DocumentService {
    generateDocument(data: DocumentData, options: DocumentGenerationOptions): Promise<DocumentGenerationResult>;
    getDocumentTemplate(templateId: string): Promise<DocumentTemplate>;
}
