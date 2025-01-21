import express from 'express';
import { processMedia } from './service';
import { handleError } from '../../utils/errorHandler';
const router = express.Router();
// Process media
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const options = req.body.options;
        const result = await processMedia(data, options);
        if (result.success) {
            res.json(result.media);
        }
        else {
            res.status(400).json({ error: result.error });
        }
    }
    catch (error) {
        handleError(error, res);
    }
});
export default router;
