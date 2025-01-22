import { CallEventPayload } from './retell/types.js';

export class WebhookService {
  async handleWebhook(event: CallEventPayload) {
    try {
      console.log('Processing webhook event:', event);

      switch (event.eventType) {
        case 'call.started':
          await this.handleCallStarted(event);
          break;
        case 'call.ended':
          await this.handleCallEnded(event);
          break;
        case 'call.transcription':
          await this.handleCallTranscription(event);
          break;
        default:
          console.log(`Unhandled event type: ${event.eventType}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private async handleCallStarted(event: CallEventPayload) {
    try {
      // Update campaign metrics
      // TODO: Implement campaign metrics update logic
      console.log('Call started:', event.callId);
    } catch (error) {
      console.error('Error handling call started event:', error);
      throw error;
    }
  }

  private async handleCallEnded(event: CallEventPayload) {
    try {
      // Update campaign metrics and status
      // TODO: Implement campaign metrics and status update logic
      console.log('Call ended:', event.callId);
    } catch (error) {
      console.error('Error handling call ended event:', error);
      throw error;
    }
  }

  private async handleCallTranscription(event: CallEventPayload) {
    try {
      // Store transcription data
      // TODO: Implement transcription storage logic
      console.log('Call transcription received:', event.callId);
    } catch (error) {
      console.error('Error handling call transcription event:', error);
      throw error;
    }
  }
}