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
    const response = await fetch(`${this.config.baseUrl}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        agent_id: this.config.agentId,
        customer_number: phoneNumber,
        llm_id: this.config.llmId,
        ...config,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate call: ${response.statusText}`);
    }

    return response.json();
  }

  connectWebSocket(
    callId: string,
    handlers: {
      onTranscription?: (data: CallEventPayload & { eventType: "call.transcription" }) => void;
      onCallEnded?: (data: CallEventPayload & { eventType: "call.ended" }) => void;
      onError?: (error: Error) => void;
    },
  ): void {
    try {
      this.ws = new WebSocket(`${this.config.wsUrl}?call_id=${callId}`);

      this.ws.on("open", () => {
        console.log("WebSocket connection established for call:", callId);
      });

      this.ws.on("message", (data: string) => {
        try {
          const event = JSON.parse(data) as CallEventPayload;

          switch (event.eventType) {
            case "call.transcription":
              handlers.onTranscription?.(event as CallEventPayload & { eventType: "call.transcription" });
              break;
            case "call.ended":
              handlers.onCallEnded?.(event as CallEventPayload & { eventType: "call.ended" });
              this.disconnect();
              break;
          }
        } catch (error) {
          handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      });

      this.ws.on("error", (error) => {
        handlers.onError?.(error);
      });

      this.ws.on("close", () => {
        console.log("WebSocket connection closed for call:", callId);
      });
    } catch (error) {
      handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getCallRecording(callId: string): Promise<Blob> {
    const response = await fetch(
      `${this.config.baseUrl}/call/${callId}/recording`,
      {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get call recording: ${response.statusText}`);
    }

    return response.blob();
  }

  async updateCallConfig(callId: string, config: CallConfig): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/call/${callId}/config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update call config: ${response.statusText}`);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export function createRetellService(config: RetellConfig): RetellService {
  return new RetellService(config);
}
