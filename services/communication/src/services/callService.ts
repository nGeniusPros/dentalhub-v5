import { RetellService } from "./retell/RetellService.js";
import { RetellConfig, CallConfig } from "./retell/types.js";

export class CallService {
  private retellService: RetellService;

  constructor(config: RetellConfig) {
    this.retellService = new RetellService(config);
  }

  async initiateCall(phoneNumber: string, config?: CallConfig) {
    return await this.retellService.initiateCall(phoneNumber, config);
  }

  async getCallRecording(callId: string) {
    return await this.retellService.getCallRecording(callId);
  }

  async updateCallConfig(callId: string, config: CallConfig) {
    return await this.retellService.updateCallConfig(callId, config);
  }
}
