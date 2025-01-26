import {
  WebhookEvent,
  RetellWebhookEvent,
  SikkaWebhookEvent,
  OpenAIWebhookEvent,
  RetellCallStartedEvent,
  RetellCallEndedEvent,
  RetellTranscriptionEvent,
  RetellRecordingEvent,
  SikkaEligibilityVerifiedEvent,
  SikkaClaimStatusEvent,
  SikkaPreAuthStatusEvent,
  SikkaBenefitsUpdateEvent,
  OpenAICompletionEvent,
  OpenAIErrorEvent,
  OpenAIModeratedEvent,
} from "@dentalhub/types/webhooks";

export class WebhookService {
  async handleWebhook(event: WebhookEvent) {
    try {
      console.log("Processing webhook event:", event);

      // Determine event type and route to appropriate handler
      if (this.isRetellEvent(event)) {
        await this.handleRetellEvent(event);
      } else if (this.isSikkaEvent(event)) {
        await this.handleSikkaEvent(event);
      } else if (this.isOpenAIEvent(event)) {
        await this.handleOpenAIEvent(event);
      } else {
        console.warn("Unknown event type:", event);
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      throw error;
    }
  }

  // Type guards for event types
  private isRetellEvent(event: WebhookEvent): event is RetellWebhookEvent {
    return event.eventType.startsWith("call.");
  }

  private isSikkaEvent(event: WebhookEvent): event is SikkaWebhookEvent {
    return ["eligibility.", "claim.", "preauth.", "benefits."].some((prefix) =>
      event.eventType.startsWith(prefix),
    );
  }

  private isOpenAIEvent(event: WebhookEvent): event is OpenAIWebhookEvent {
    return ["completion.", "error", "moderation."].some((prefix) =>
      event.eventType.startsWith(prefix),
    );
  }

  // Retell event handlers
  private async handleRetellEvent(event: RetellWebhookEvent) {
    switch (event.eventType) {
      case "call.started":
        await this.handleCallStarted(event);
        break;
      case "call.ended":
        await this.handleCallEnded(event);
        break;
      case "call.transcription":
        await this.handleCallTranscription(event);
        break;
      case "call.recording":
        await this.handleCallRecording(event);
        break;
      default:
        console.warn("Unhandled Retell event type:", event.eventType);
    }
  }

  private async handleCallStarted(event: RetellCallStartedEvent) {
    try {
      await this.updateCallStatus(event.callId, "started", {
        agentId: event.data.agentId,
        customerId: event.data.customerId,
        startTime: event.data.startTime,
      });
      console.log("Call started:", event.callId);
    } catch (error) {
      console.error("Error handling call started event:", error);
      throw error;
    }
  }

  private async handleCallEnded(event: RetellCallEndedEvent) {
    try {
      await this.updateCallStatus(event.callId, "ended", {
        duration: event.data.duration,
        endTime: event.data.endTime,
        reason: event.data.reason,
      });
      console.log("Call ended:", event.callId);
    } catch (error) {
      console.error("Error handling call ended event:", error);
      throw error;
    }
  }

  private async handleCallTranscription(event: RetellTranscriptionEvent) {
    try {
      await this.storeTranscription(event.callId, {
        text: event.data.text,
        speakerId: event.data.speakerId,
        speakerType: event.data.speakerType,
        startTime: event.data.startTime,
        endTime: event.data.endTime,
      });
      console.log("Call transcription received:", event.callId);
    } catch (error) {
      console.error("Error handling call transcription event:", error);
      throw error;
    }
  }

  private async handleCallRecording(event: RetellRecordingEvent) {
    try {
      await this.storeRecording(event.callId, {
        url: event.data.url,
        duration: event.data.duration,
        format: event.data.format,
      });
      console.log("Call recording received:", event.callId);
    } catch (error) {
      console.error("Error handling call recording event:", error);
      throw error;
    }
  }

  // Sikka event handlers
  private async handleSikkaEvent(event: SikkaWebhookEvent) {
    switch (event.eventType) {
      case "eligibility.verified":
        await this.handleEligibilityVerified(event);
        break;
      case "claim.status_update":
        await this.handleClaimStatusUpdate(event);
        break;
      case "preauth.status_update":
        await this.handlePreAuthStatusUpdate(event);
        break;
      case "benefits.update":
        await this.handleBenefitsUpdate(event);
        break;
      default:
        console.warn("Unhandled Sikka event type:", event.eventType);
    }
  }

  private async handleEligibilityVerified(
    event: SikkaEligibilityVerifiedEvent,
  ) {
    try {
      await this.updateEligibilityStatus(event.data.patientId, {
        status: event.data.status,
        verificationDate: event.data.verificationDate,
        coverage: event.data.coverage,
      });
      console.log("Eligibility verified for patient:", event.data.patientId);
    } catch (error) {
      console.error("Error handling eligibility verified event:", error);
      throw error;
    }
  }

  private async handleClaimStatusUpdate(event: SikkaClaimStatusEvent) {
    try {
      await this.updateClaimStatus(event.data.claimId, {
        status: event.data.status,
        updateDate: event.data.updateDate,
        paymentAmount: event.data.paymentAmount,
        denialReason: event.data.denialReason,
        eob: event.data.eob,
      });
      console.log("Claim status updated:", event.data.claimId);
    } catch (error) {
      console.error("Error handling claim status update event:", error);
      throw error;
    }
  }

  private async handlePreAuthStatusUpdate(event: SikkaPreAuthStatusEvent) {
    try {
      await this.updatePreAuthStatus(event.data.preAuthId, {
        status: event.data.status,
        updateDate: event.data.updateDate,
        approvedProcedures: event.data.approvedProcedures,
        denialReason: event.data.denialReason,
        additionalInfoRequired: event.data.additionalInfoRequired,
      });
      console.log("Pre-auth status updated:", event.data.preAuthId);
    } catch (error) {
      console.error("Error handling pre-auth status update event:", error);
      throw error;
    }
  }

  private async handleBenefitsUpdate(event: SikkaBenefitsUpdateEvent) {
    try {
      await this.updateBenefits(event.data.patientId, {
        insuranceId: event.data.insuranceId,
        updateDate: event.data.updateDate,
        changes: event.data.changes,
      });
      console.log("Benefits updated for patient:", event.data.patientId);
    } catch (error) {
      console.error("Error handling benefits update event:", error);
      throw error;
    }
  }

  // OpenAI event handlers
  private async handleOpenAIEvent(event: OpenAIWebhookEvent) {
    switch (event.eventType) {
      case "completion.finished":
        await this.handleCompletionFinished(event);
        break;
      case "error":
        await this.handleOpenAIError(event);
        break;
      case "moderation.flagged":
        await this.handleModerationFlagged(event);
        break;
      default:
        console.warn("Unhandled OpenAI event type:", event.eventType);
    }
  }

  private async handleCompletionFinished(event: OpenAICompletionEvent) {
    try {
      await this.storeCompletion(event.data.completionId, {
        requestId: event.data.requestId,
        model: event.data.model,
        choices: event.data.choices,
        usage: event.data.usage,
      });
      console.log("Completion finished:", event.data.completionId);
    } catch (error) {
      console.error("Error handling completion finished event:", error);
      throw error;
    }
  }

  private async handleOpenAIError(event: OpenAIErrorEvent) {
    try {
      await this.logOpenAIError(event.data.requestId, event.data.error);
      console.error("OpenAI error:", event.data.error);
    } catch (error) {
      console.error("Error handling OpenAI error event:", error);
      throw error;
    }
  }

  private async handleModerationFlagged(event: OpenAIModeratedEvent) {
    try {
      await this.handleModeration(event.data.requestId, event.data.results);
      console.warn("Content flagged by moderation:", event.data.requestId);
    } catch (error) {
      console.error("Error handling moderation flagged event:", error);
      throw error;
    }
  }

  // Database update methods (to be implemented)
  private async updateCallStatus(callId: string, status: string, data: any) {
    // TODO: Implement call status update in database
  }

  private async storeTranscription(callId: string, data: any) {
    // TODO: Implement transcription storage in database
  }

  private async storeRecording(callId: string, data: any) {
    // TODO: Implement recording storage in database
  }

  private async updateEligibilityStatus(patientId: string, data: any) {
    // TODO: Implement eligibility status update in database
  }

  private async updateClaimStatus(claimId: string, data: any) {
    // TODO: Implement claim status update in database
  }

  private async updatePreAuthStatus(preAuthId: string, data: any) {
    // TODO: Implement pre-auth status update in database
  }

  private async updateBenefits(patientId: string, data: any) {
    // TODO: Implement benefits update in database
  }

  private async storeCompletion(completionId: string, data: any) {
    // TODO: Implement completion storage in database
  }

  private async logOpenAIError(requestId: string, error: any) {
    // TODO: Implement OpenAI error logging in database
  }

  private async handleModeration(requestId: string, results: any) {
    // TODO: Implement moderation handling in database
  }
}
