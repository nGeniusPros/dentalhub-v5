import express from 'express';
import { synchronize } from './service';
import { handleError } from '../../utils/errorHandler';
const router = express.Router();
// Synchronize calendar or contacts
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const options = req.body.options;
        const result = await synchronize(data, options);
        if (result.success) {
            res.json(result);
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
