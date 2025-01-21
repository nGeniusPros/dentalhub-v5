import { RetellConfig, CallResponse, CallConfig } from './types';
export declare class RetellService {
    private config;
    private ws;
    constructor(config: RetellConfig);
    initiateCall(phoneNumber: string, config?: CallConfig): Promise<CallResponse>;
    connectWebSocket(callId: string, handlers: {
        onTranscription?: (data: any) => void;
        onCallEnded?: (data: any) => void;
        onError?: (error: any) => void;
    }): void;
    getCallRecording(callId: string): Promise<Blob>;
    updateCallConfig(callId: string, config: CallConfig): Promise<void>;
    disconnect(): void;
}
export declare const createRetellService: (config: RetellConfig) => RetellService;
