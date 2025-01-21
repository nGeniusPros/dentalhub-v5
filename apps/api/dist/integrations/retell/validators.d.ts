import { Request, Response, NextFunction } from 'express';
import { WebhookEvent, CallStatus, TranscriptionResult, AIAnalysisResult } from './types';
declare function isCallStatus(data: any): data is CallStatus;
declare function isTranscriptionResult(data: any): data is TranscriptionResult;
declare function isAIAnalysisResult(data: any): data is AIAnalysisResult;
declare function isWebhookEvent(data: any): data is WebhookEvent;
export declare function validateWebhook(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare const validateVoiceCallRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateWebhookEvent: (req: Request, res: Response, next: NextFunction) => void;
export declare const typeGuards: {
    isCallStatus: typeof isCallStatus;
    isTranscriptionResult: typeof isTranscriptionResult;
    isAIAnalysisResult: typeof isAIAnalysisResult;
    isWebhookEvent: typeof isWebhookEvent;
};
export {};
