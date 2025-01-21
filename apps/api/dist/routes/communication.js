import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const initiateCallSchema = z.object({
    phoneNumber: z.string().min(1),
});
const updateCallConfigSchema = z.object({
    recordingConfig: z.object({
        enabled: z.boolean(),
        format: z.enum(['mp3', 'wav']).optional(),
    }).optional(),
    llmConfig: z.object({
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
    }).optional(),
    webhookConfig: z.object({
        url: z.string().url(),
        events: z.array(z.string()),
    }).optional(),
});
const callIdSchema = z.object({
    callId: z.string().min(1),
});
router.post('/calls', asyncHandler(async (req, res) => {
    const validationResult = initiateCallSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    const { phoneNumber } = validationResult.data;
    const result = await req.retell.initiateCall(phoneNumber);
    res.json(result);
}));
router.get('/calls/:callId/recording', asyncHandler(async (req, res) => {
    const validationResult = callIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid call ID' });
    }
    const recording = await req.retell.getCallRecording(req.params.callId);
    res.type('audio/wav').send(recording);
}));
router.put('/calls/:callId/config', asyncHandler(async (req, res) => {
    const validationResult = callIdSchema.safeParse(req.params);
    const configValidationResult = updateCallConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid call ID' });
    }
    if (!configValidationResult.success) {
        return res.status(400).json({ error: 'Invalid call config data' });
    }
    await req.retell.updateCallConfig(req.params.callId, configValidationResult.data);
    res.status(204).send();
}));
export const communicationRoutes = router;
