import express from 'express';
import { generateDocument, getDocumentTemplate } from './service';
import { DocumentData, DocumentGenerationOptions } from './types';
import { handleDocumentError } from './error';
import { handleError } from '../../utils/errorHandler';
import { Router } from 'express';

const router: Router = express.Router();

// Generate a document
router.post('/', async (req, res) => {
  try {
    const data = req.body as DocumentData;
    const options = req.body.options as DocumentGenerationOptions;
    const result = await generateDocument(data, options);
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
    const template = await getDocumentTemplate(req.params.templateId);
    res.json(template);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;