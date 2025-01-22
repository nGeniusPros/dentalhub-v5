import { CallEventPayload } from './retell/types.js';
export declare class WebhookService {
    handleWebhook(event: CallEventPayload): Promise<void>;
    private handleCallStarted;
    private handleCallEnded;
    private handleCallTranscription;
}
