import WebSocket from "ws";
export class RetellService {
    constructor(config) {
        this.ws = null;
        this.config = config;
    }
    async initiateCall(phoneNumber, config) {
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
    connectWebSocket(callId, handlers) {
        try {
            this.ws = new WebSocket(`${this.config.wsUrl}?call_id=${callId}`);
            this.ws.on("open", () => {
                console.log("WebSocket connection established for call:", callId);
            });
            this.ws.on("message", (data) => {
                try {
                    const event = JSON.parse(data);
                    switch (event.eventType) {
                        case "call.transcription":
                            handlers.onTranscription?.(event);
                            break;
                        case "call.ended":
                            handlers.onCallEnded?.(event);
                            this.disconnect();
                            break;
                    }
                }
                catch (error) {
                    handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
                }
            });
            this.ws.on("error", (error) => {
                handlers.onError?.(error);
            });
            this.ws.on("close", () => {
                console.log("WebSocket connection closed for call:", callId);
            });
        }
        catch (error) {
            handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
        }
    }
    async getCallRecording(callId) {
        const response = await fetch(`${this.config.baseUrl}/call/${callId}/recording`, {
            headers: {
                Authorization: `Bearer ${this.config.apiKey}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to get call recording: ${response.statusText}`);
        }
        return response.blob();
    }
    async updateCallConfig(callId, config) {
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
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
export function createRetellService(config) {
    return new RetellService(config);
}
//# sourceMappingURL=RetellService.js.map