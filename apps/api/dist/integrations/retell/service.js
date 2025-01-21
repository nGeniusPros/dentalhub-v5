import axios from 'axios';
import { handleRetellError, isRetryableError } from './error';
import { retellConfig, CALL_CONFIG, QUEUE_CONFIG, ANALYSIS_CONFIG } from './config';
import { apiCache } from '../../utils/cache';
// Initialize axios instance for Retell API
const retellApi = axios.create({
    baseURL: retellConfig.baseUrl,
    headers: {
        'Authorization': `Bearer ${retellConfig.apiKey}`,
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});
// Add retry interceptor
retellApi.interceptors.response.use(response => response, async (error) => {
    let retryCount = 0;
    const originalRequest = error.config;
    while (retryCount < QUEUE_CONFIG.maxRetries && isRetryableError(error)) {
        retryCount++;
        const delayMs = QUEUE_CONFIG.retryDelays[retryCount - 1];
        await new Promise(resolve => setTimeout(resolve, delayMs));
        try {
            return await retellApi(originalRequest);
        }
        catch (retryError) {
            error = retryError;
        }
    }
    throw error;
});
/**
 * Initiates a voice call
 */
export async function initiateCall(request) {
    try {
        const response = await retellApi.post('/calls', {
            patient_id: request.patientId,
            phone_number: request.phoneNumber,
            purpose: request.purpose,
            custom_script: request.customScript,
            language: request.language || CALL_CONFIG.defaultLanguage,
            priority: request.priority || 'normal',
            config: {
                max_duration: CALL_CONFIG.maxDuration,
                recording_enabled: CALL_CONFIG.recordingEnabled,
                transcription_enabled: CALL_CONFIG.transcriptionEnabled,
                ai_analysis_enabled: CALL_CONFIG.aiAnalysisEnabled,
            },
        });
        return response.data.data;
    }
    catch (error) {
        throw handleRetellError(error);
    }
}
/**
 * Retrieves call status
 */
export async function getCallStatus(callId) {
    const cacheKey = `getCallStatus-${callId}`;
    return apiCache.get(cacheKey, async () => {
        try {
            const response = await retellApi.get(`/calls/${callId}`);
            return response.data.data;
        }
        catch (error) {
            throw handleRetellError(error);
        }
    });
}
/**
 * Retrieves call transcription
 */
export async function getTranscription(callId) {
    const cacheKey = `getTranscription-${callId}`;
    return apiCache.get(cacheKey, async () => {
        try {
            const response = await retellApi.get(`/calls/${callId}/transcription`);
            return response.data.data;
        }
        catch (error) {
            throw handleRetellError(error);
        }
    });
}
/**
 * Retrieves AI analysis of the call
 */
export async function getAnalysis(callId) {
    const cacheKey = `getAnalysis-${callId}`;
    return apiCache.get(cacheKey, async () => {
        try {
            const response = await retellApi.get(`/calls/${callId}/analysis`, {
                params: {
                    sentiment: ANALYSIS_CONFIG.sentiment.enabled,
                    sentiment_threshold: ANALYSIS_CONFIG.sentiment.threshold,
                    intents: ANALYSIS_CONFIG.intents.enabled,
                    intent_confidence: ANALYSIS_CONFIG.intents.minConfidence,
                    entities: ANALYSIS_CONFIG.entities.enabled,
                    entity_confidence: ANALYSIS_CONFIG.entities.minConfidence,
                    summary: ANALYSIS_CONFIG.summary.enabled,
                    summary_length: ANALYSIS_CONFIG.summary.maxLength,
                },
            });
            return response.data.data;
        }
        catch (error) {
            throw handleRetellError(error);
        }
    });
}
/**
 * Cancels an ongoing call
 */
export async function cancelCall(callId) {
    try {
        await retellApi.post(`/calls/${callId}/cancel`);
    }
    catch (error) {
        throw handleRetellError(error);
    }
}
/**
 * Updates call priority in the queue
 */
export async function updateCallPriority(callId, priority) {
    try {
        const response = await retellApi.patch(`/calls/${callId}`, { priority });
        return response.data.data;
    }
    catch (error) {
        throw handleRetellError(error);
    }
}
/**
 * Retrieves call recording URL
 */
export async function getRecordingUrl(callId) {
    try {
        const response = await retellApi.get(`/calls/${callId}/recording`);
        return response.data.data.url;
    }
    catch (error) {
        throw handleRetellError(error);
    }
}
/**
 * Processes webhook events
 */
export async function processWebhookEvent(event, signature) {
    // Implementation would handle different event types and update local state
    switch (event.type) {
        case 'call.completed':
            await handleCallCompleted(event.data);
            break;
        case 'call.failed':
            await handleCallFailed(event.data);
            break;
        case 'transcription.completed':
            await handleTranscriptionCompleted(event.data);
            break;
        case 'analysis.completed':
            await handleAnalysisCompleted(event.data);
            break;
    }
}
// Private helper functions for webhook event handling
async function handleCallCompleted(status) {
    // Implementation would update local database with call status
    console.log('Call completed:', status);
}
async function handleCallFailed(status) {
    // Implementation would handle failed calls, possibly retry or notify
    console.log('Call failed:', status);
}
async function handleTranscriptionCompleted(result) {
    // Implementation would store transcription result
    console.log('Transcription completed:', result);
}
async function handleAnalysisCompleted(result) {
    // Implementation would store analysis result and trigger any necessary actions
    console.log('Analysis completed:', result);
}
