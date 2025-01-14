import express from 'express';
import { DocumentData, DocumentGenerationOptions } from './types';
import { handleDocumentError } from './error';
import { handleError } from '../../utils/errorHandler';
import { Router } from 'express';
import { DocumentService } from '../../services/documentService';

const router: Router = express.Router();

// Generate a document
router.post('/', async (req, res) => {
  try {
    const data = req.body as DocumentData;
    const options = req.body.options as DocumentGenerationOptions;
    const documentService = new DocumentService();
    const result = await documentService.generateDocument(data, options);
    if (result.success) {
      res.json(result.document);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    handleError(error, res);
		}
});
	
// Get a document template
router.get('/templates/:templateId', async (req, res) => {
  try {
    const documentService = new DocumentService();
    const template = await documentService.getDocumentTemplate(req.params.templateId);
    res.json(template);
  } catch (error) {
				handleError(error, res);
	}
});
	
export default router;