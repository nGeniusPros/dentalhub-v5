import { RetellConfig } from './types';
export declare const retellConfig: RetellConfig;
export declare const RETELL_API_KEY: RetellConfig, RETELL_BASE_URL: RetellConfig, RETELL_WS_URL: RetellConfig, RETELL_WEBHOOK_URL: RetellConfig, RETELL_WEBHOOK_SECRET: RetellConfig, RETELL_AGENTS: RetellConfig;
export declare const CALL_CONFIG: {
    maxDuration: number;
    maxRetries: number;
    minDelayBetweenCalls: number;
    defaultLanguage: string;
    recordingEnabled: boolean;
    transcriptionEnabled: boolean;
    aiAnalysisEnabled: boolean;
};
export declare const QUEUE_CONFIG: {
    maxConcurrentCalls: number;
    priorityLevels: {
        high: number;
        normal: number;
        low: number;
    };
    retryDelays: number[];
    maxRetries: number;
};
export declare const WEBHOOK_CONFIG: {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
    signatureHeader: string;
};
export declare const ANALYSIS_CONFIG: {
    sentiment: {
        enabled: boolean;
        threshold: number;
    };
    intents: {
        enabled: boolean;
        minConfidence: number;
    };
    entities: {
        enabled: boolean;
        minConfidence: number;
    };
    summary: {
        enabled: boolean;
        maxLength: number;
    };
};
