import { z } from 'zod';
const campaignSchema = z.object({
    name: z.string().min(3),
    type: z.enum(['voice', 'sms', 'email']),
    audience: z.object({
        filters: z.record(z.any())
    }),
    content: z.object({
        template: z.string().min(10)
    }),
    schedule: z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime().optional(),
        timezone: z.string()
    }).optional(),
    settings: z.object({
        retryCount: z.number().optional(),
        retryDelay: z.number().optional(),
        callbackUrl: z.string().url().optional()
    }).optional(),
    metadata: z.record(z.any()).optional()
});
export const validateCampaign = (req, res, next) => {
    try {
        campaignSchema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
};
import crypto from 'crypto';
export const validateWebhookSignature = (req, res, next) => {
    const signature = req.headers['x-retell-signature'];
    const webhookSecret = process.env.RETELL_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('RETELL_WEBHOOK_SECRET is not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    if (!signature || typeof signature !== 'string') {
        return res.status(401).json({ error: 'Missing webhook signature' });
    }
    try {
        // Get raw body from the request
        const rawBody = JSON.stringify(req.body);
        // Create HMAC using webhook secret
        const hmac = crypto.createHmac('sha256', webhookSecret);
        hmac.update(rawBody);
        const calculatedSignature = hmac.digest('hex');
        // Compare signatures using constant-time comparison
        const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }
        next();
    }
    catch (error) {
        console.error('Error validating webhook signature:', error);
        return res.status(401).json({ error: 'Invalid webhook signature' });
    }
};
