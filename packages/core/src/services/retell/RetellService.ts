import WebSocket from "ws";
import {
  RetellConfig,
  CallEventPayload,
  CallResponse,
  CallConfig,
} from "./types";

export class RetellService {
  private config: RetellConfig;
  private ws: WebSocket | null = null;

  constructor(config: RetellConfig) {
    this.config = config;
  }

  async initiateCall(
    phoneNumber: string,
    config?: CallConfig,
  ): Promise<CallResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/calls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: this.config.agentId,
          llm_id: this.config.llmId,
          customer_number: phoneNumber,
          recording_config: config?.recordingConfig,
          llm_config: config?.llmConfig,
          webhook_config: config?.webhookConfig || {
            url: process.env.RETELL_WEBHOOK_URL,
            events: ["call.started", "call.ended", "call.transcription"],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate call: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error initiating call:", error);
      throw error;
    }
  }

  connectWebSocket(
    callId: string,
    handlers: {
      onTranscription?: (data: any) => void;
      onCallEnded?: (data: any) => void;
      onError?: (error: any) => void;
    },
  ): void {
    try {
      this.ws = new WebSocket(`${this.config.wsUrl}?call_id=${callId}`);

      this.ws.on("open", () => {
        console.log("WebSocket connection established for call:", callId);
      });

      this.ws.on("message", (data: string) => {
        const event: CallEventPayload = JSON.parse(data);

        switch (event.eventType) {
          case "call.transcription":
            handlers.onTranscription?.(event.data);
            break;
          case "call.ended":
            handlers.onCallEnded?.(event.data);
            this.ws?.close();
            break;
          default:
            console.log(`Unhandled event type: ${event.eventType}`);
        }
      });

      this.ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        handlers.onError?.(error);
      });

      this.ws.on("close", () => {
        console.log("WebSocket connection closed for call:", callId);
      });
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      throw error;
    }
  }

  async getCallRecording(callId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/calls/${callId}/recording`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get call recording: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error getting call recording:", error);
      throw error;
    }
  }

  async updateCallConfig(callId: string, config: CallConfig): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/calls/${callId}/config`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update call config: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating call config:", error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const createRetellService = (config: RetellConfig): RetellService => {
  return new RetellService(config);
};
