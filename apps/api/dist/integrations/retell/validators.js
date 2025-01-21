import { validateWebhookSignature } from './error';
import { RETELL_WEBHOOK_SECRET } from './config';
function createValidator(validate) {
    return (req, res, next) => {
        if (validate(req.body)) {
            next();
        }
        else {
            res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request data',
                }
            });
        }
    };
}
// Type guards for request validation
function isVoiceCallRequest(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.patientId === 'string' &&
        typeof data.phoneNumber === 'string' &&
        typeof data.purpose === 'string' &&
        ['appointment_reminder', 'follow_up', 'billing', 'custom'].includes(data.purpose) &&
        (data.customScript === undefined || typeof data.customScript === 'string') &&
        (data.language === undefined || typeof data.language === 'string') &&
        (data.priority === undefined || ['high', 'normal', 'low'].includes(data.priority)));
}
function isCallStatus(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.callId === 'string' &&
        typeof data.status === 'string' &&
        ['queued', 'in_progress', 'completed', 'failed'].includes(data.status) &&
        (data.duration === undefined || typeof data.duration === 'number') &&
        (data.startTime === undefined || typeof data.startTime === 'string') &&
        (data.endTime === undefined || typeof data.endTime === 'string'));
}
function isTranscriptionResult(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.callId === 'string' &&
        typeof data.transcript === 'string' &&
        typeof data.confidence === 'number' &&
        Array.isArray(data.segments) &&
        data.segments.every((segment) => typeof segment === 'object' &&
            segment !== null &&
            ['ai', 'human'].includes(segment.speaker) &&
            typeof segment.text === 'string' &&
            typeof segment.startTime === 'number' &&
            typeof segment.endTime === 'number'));
}
function isAIAnalysisResult(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.callId === 'string' &&
        typeof data.sentiment === 'object' &&
        typeof data.sentiment.overall === 'number' &&
        Array.isArray(data.sentiment.segments) &&
        Array.isArray(data.intents) &&
        Array.isArray(data.entities) &&
        typeof data.summary === 'string' &&
        Array.isArray(data.actionItems));
}
function isWebhookEvent(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.type === 'string' &&
        ['call.completed', 'call.failed', 'transcription.completed', 'analysis.completed'].includes(data.type) &&
        typeof data.timestamp === 'string' &&
        typeof data.data === 'object');
}
// Webhook signature validation middleware
export function validateWebhook(req, res, next) {
    const signature = req.headers['x-retell-signature'];
    if (!signature || typeof signature !== 'string') {
        return res.status(401).json({
            error: {
                code: 'INVALID_SIGNATURE',
                message: 'Missing or invalid webhook signature',
            }
        });
    }
    try {
        const isValid = validateWebhookSignature(signature, JSON.stringify(req.body), RETELL_WEBHOOK_SECRET);
        if (!isValid) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_SIGNATURE',
                    message: 'Invalid webhook signature',
                }
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
// Export middleware validators
export const validateVoiceCallRequest = createValidator(isVoiceCallRequest);
export const validateWebhookEvent = createValidator(isWebhookEvent);
// Export type guards for use in service layer
export const typeGuards = {
    isCallStatus,
    isTranscriptionResult,
    isAIAnalysisResult,
    isWebhookEvent,
};
