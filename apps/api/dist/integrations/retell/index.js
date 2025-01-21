import express from 'express';
import { initiateCall, getCallStatus, getTranscription, getAnalysis, cancelCall, updateCallPriority, processWebhookEvent, getRecordingUrl } from './service';
import { validateVoiceCallRequest, validateWebhook, typeGuards } from './validators';
import { handleWebhookError } from './error';
import { handleError } from '../../utils/errorHandler';
const router = express.Router();
// Initiate a voice call
router.post('/calls', validateVoiceCallRequest, async (req, res) => {
    try {
        const result = await initiateCall(req.body);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Get call status
router.get('/calls/:callId', async (req, res) => {
    try {
        const result = await getCallStatus(req.params.callId);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Get call transcription
router.get('/calls/:callId/transcription', async (req, res) => {
    try {
        const result = await getTranscription(req.params.callId);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Get call analysis
router.get('/calls/:callId/analysis', async (req, res) => {
    try {
        const result = await getAnalysis(req.params.callId);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Cancel a call
router.post('/calls/:callId/cancel', async (req, res) => {
    try {
        await cancelCall(req.params.callId);
        res.status(204).send();
    }
    catch (error) {
        handleError(error, res);
    }
});
// Update call priority
router.patch('/calls/:callId', async (req, res) => {
    try {
        const result = await updateCallPriority(req.params.callId, req.body.priority);
        res.json(result);
    }
    catch (error) {
        handleError(error, res);
    }
});
// Get call recording URL
router.get('/calls/:callId/recording', async (req, res) => {
    try {
        const result = await getRecordingUrl(req.params.callId);
        res.json({ url: result });
    }
    catch (error) {
        handleError(error, res);
    }
});
// Webhook endpoint
router.post('/webhook', validateWebhook, async (req, res) => {
    try {
        if (!typeGuards.isWebhookEvent(req.body)) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_WEBHOOK_EVENT',
                    message: 'Invalid webhook event format',
                }
            });
        }
        await processWebhookEvent(req.body, req.headers['x-retell-signature']);
        res.status(204).send();
    }
    catch (error) {
        const webhookError = handleWebhookError(error);
        res.status(400).json({ error: webhookError });
    }
});
export default router;
