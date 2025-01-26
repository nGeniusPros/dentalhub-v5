import { RetellConfig, CallEventPayload, CallResponse, CallConfig } from "./types";
export declare class RetellService {
    private config;
    private ws;
    constructor(config: RetellConfig);
    initiateCall(phoneNumber: string, config?: CallConfig): Promise<CallResponse>;
    connectWebSocket(callId: string, handlers: {
        onTranscription?: (data: CallEventPayload & {
            eventType: "call.transcription";
        }) => void;
        onCallEnded?: (data: CallEventPayload & {
            eventType: "call.ended";
        }) => void;
        onError?: (error: Error) => void;
    }): void;
    getCallRecording(callId: string): Promise<Blob>;
    updateCallConfig(callId: string, config: CallConfig): Promise<void>;
    disconnect(): void;
}
export declare function createRetellService(config: RetellConfig): RetellService;
