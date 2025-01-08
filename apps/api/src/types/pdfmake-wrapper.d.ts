declare module 'pdfmake-wrapper' {
    import { TDocumentDefinitions } from 'pdfmake/interfaces';
    class Document {
        constructor(docDefinition: TDocumentDefinitions);
        toBuffer(): Promise<Buffer>;
    }
    export { Document };
}