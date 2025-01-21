import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const getAvailabilitySchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    provider_id: z.string().optional(),
});
router.get('/', asyncHandler(async (req, res) => {
    const validationResult = getAvailabilitySchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const { start_date, end_date, provider_id } = validationResult.data;
    // Placeholder for actual availability logic
    res.json({ message: 'Availability routes', start_date, end_date, provider_id });
}));
export default router;
