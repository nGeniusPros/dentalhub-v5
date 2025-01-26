import { handleDocumentError } from '../edge-functions/documents/error';
import { v4 as uuidv4 } from 'uuid';
import pdfMake from 'pdfmake/build/pdfmake';
import { promises as fs } from 'fs';
import path from 'path';
import { edgeCache } from '../utils/cache';
async function generatePdf(data, config) {
    return new Promise((resolve, reject) => {
        try {
            const docDefinition = {
                content: [
                    { text: `Document Type: ${data.type}`, style: 'header' },
                    { text: `Template ID: ${data.templateId}`, style: 'subheader' },
                    { text: `Data: ${JSON.stringify(data.data, null, 2)}`, style: 'body' },
                ],
                styles: {
                    header: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
                    subheader: { fontSize: 16, bold: true, margin: [0, 0, 0, 5] },
                    body: { fontSize: 12, margin: [0, 0, 0, 5] },
                }
            };
            const pdfDoc = pdfMake.createPdf(docDefinition);
            pdfDoc.getBuffer((buffer) => {
                resolve(buffer);
            });
        }
        catch (error) {
            reject(handleDocumentError(error, 'PDF_GENERATION_FAILED'));
        }
    });
}
async function generateDocx(data, config) {
    try {
        const docxContent = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>Document Type: ${data.type}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Template ID: ${data.templateId}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Data: ${JSON.stringify(data.data, null, 2)}</w:t></w:r></w:p>
        </w:body>
      </w:document>
    `;
        return Buffer.from(docxContent, 'utf-8');
    }
    catch (error) {
        throw handleDocumentError(error, 'DOCX_GENERATION_FAILED');
    }
}
async function storeDocument(buffer, options) {
    try {
        const documentId = uuidv4();
        const filePath = path.join(options.path, `${documentId}.${options.path.split('.').pop()}`);
        await fs.writeFile(filePath, buffer);
        return `file://${filePath}`;
    }
    catch (error) {
        throw handleDocumentError(error, 'DOCUMENT_STORAGE_FAILED');
    }
}
function generateDocumentCacheKey(data, options) {
    const key = {
        type: data.type,
        templateId: data.templateId,
        data: data.data,
        format: options.config?.outputFormat || 'pdf',
    };
    return `document-${JSON.stringify(key)}`;
}
export class DocumentService {
    async generateDocument(data, options) {
        const cacheKey = generateDocumentCacheKey(data, options);
        return edgeCache.get(cacheKey, async () => {
            try {
                const documentId = uuidv4();
                const config = options.config || {
                    outputFormat: 'pdf',
                    template: 'default',
                };
                let buffer;
                if (config.outputFormat === 'pdf') {
                    buffer = await generatePdf(data, config);
                }
                else if (config.outputFormat === 'docx') {
                    buffer = await generateDocx(data, config);
                }
                else {
                    throw handleDocumentError(new Error(`Unsupported output format: ${config.outputFormat}`), 'UNSUPPORTED_FORMAT');
                }
                let url = '';
                if (options.storage) {
                    url = await storeDocument(buffer, {
                        ...options.storage,
                        path: options.storage.path || 'documents',
                    });
                }
                const document = {
                    documentId,
                    url,
                    type: data.type,
                    format: config.outputFormat,
                    size: buffer.length,
                    createdAt: new Date().toISOString(),
                    metadata: data.metadata,
                };
                return {
                    success: true,
                    document,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: handleDocumentError(error, 'DOCUMENT_GENERATION_FAILED'),
                };
            }
        });
    }
    async getDocumentTemplate(templateId) {
        const cacheKey = `documentTemplate-${templateId}`;
        return edgeCache.get(cacheKey, async () => {
            try {
                return {
                    id: templateId,
                    name: 'Default Template',
                    type: 'default',
                    version: '1.0',
                    content: '<h1>Default Template</h1>',
                    variables: ['patientName', 'appointmentDate'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
            }
            catch (error) {
                throw handleDocumentError(error, 'TEMPLATE_RETRIEVAL_FAILED');
            }
        });
    }
}
//# sourceMappingURL=documentService.js.map