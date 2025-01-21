import { VoiceCallRequest, CallStatus, TranscriptionResult, AIAnalysisResult, WebhookEvent } from './types';
/**
 * Initiates a voice call
 */
export declare function initiateCall(request: VoiceCallRequest): Promise<CallStatus>;
/**
 * Retrieves call status
 */
export declare function getCallStatus(callId: string): Promise<CallStatus>;
/**
 * Retrieves call transcription
 */
export declare function getTranscription(callId: string): Promise<TranscriptionResult>;
/**
 * Retrieves AI analysis of the call
 */
export declare function getAnalysis(callId: string): Promise<AIAnalysisResult>;
/**
 * Cancels an ongoing call
 */
export declare function cancelCall(callId: string): Promise<void>;
/**
 * Updates call priority in the queue
 */
export declare function updateCallPriority(callId: string, priority: 'high' | 'normal' | 'low'): Promise<CallStatus>;
/**
 * Retrieves call recording URL
 */
export declare function getRecordingUrl(callId: string): Promise<string>;
/**
 * Processes webhook events
 */
export declare function processWebhookEvent(event: WebhookEvent, signature: string): Promise<void>;
