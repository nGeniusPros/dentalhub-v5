import { RetellConfig, AgentConfig } from './types';
export declare const retellConfig: RetellConfig;
export declare const RETELL_API_KEY: string, RETELL_BASE_URL: string, RETELL_WS_URL: string, RETELL_WEBHOOK_URL: string, RETELL_WEBHOOK_SECRET: string, RETELL_AGENTS: AgentConfig[];
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
