import { RetellService } from './retell/RetellService.js';
export class CallService {
    constructor(config) {
        this.retellService = new RetellService(config);
    }
    async initiateCall(phoneNumber, config) {
        return await this.retellService.initiateCall(phoneNumber, config);
    }
    async getCallRecording(callId) {
        return await this.retellService.getCallRecording(callId);
    }
    async updateCallConfig(callId, config) {
        return await this.retellService.updateCallConfig(callId, config);
    }
}
