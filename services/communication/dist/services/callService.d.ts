import { RetellConfig, CallConfig } from './retell/types.js';
export declare class CallService {
    private retellService;
    constructor(config: RetellConfig);
    initiateCall(phoneNumber: string, config?: CallConfig): Promise<import("./retell/types.js").CallResponse>;
    getCallRecording(callId: string): Promise<Blob>;
    updateCallConfig(callId: string, config: CallConfig): Promise<void>;
}
