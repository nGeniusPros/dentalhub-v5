import {
  AssistantMessage,
  AssistantResponse,
} from "../lib/ai-agents/types/agent-types";

class AIApiService {
  private static instance: AIApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  public static getInstance(): AIApiService {
    if (!AIApiService.instance) {
      AIApiService.instance = new AIApiService();
    }
    return AIApiService.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    return response.json();
  }

  async createAssistantMessage(
    assistantId: string,
    message: AssistantMessage,
  ): Promise<AssistantResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ai/assistant/${assistantId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
          credentials: "include",
        },
      );

      return this.handleResponse<AssistantResponse>(response);
    } catch (error) {
      console.error("Failed to create assistant message:", error);
      throw error;
    }
  }

  async getThreadMessages(threadId: string): Promise<AssistantMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/threads/${threadId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return this.handleResponse<AssistantMessage[]>(response);
    } catch (error) {
      console.error("Failed to get thread messages:", error);
      throw error;
    }
  }

  async createThread(): Promise<{ threadId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return this.handleResponse<{ threadId: string }>(response);
    } catch (error) {
      console.error("Failed to create thread:", error);
      throw error;
    }
  }

  async addMessageToThread(
    threadId: string,
    content: string,
  ): Promise<AssistantMessage> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ai/threads/${threadId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
          credentials: "include",
        },
      );

      return this.handleResponse<AssistantMessage>(response);
    } catch (error) {
      console.error("Failed to add message to thread:", error);
      throw error;
    }
  }

  async runAssistant(
    threadId: string,
    assistantId: string,
  ): Promise<AssistantMessage[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ai/threads/${threadId}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assistantId }),
          credentials: "include",
        },
      );

      return this.handleResponse<AssistantMessage[]>(response);
    } catch (error) {
      console.error("Failed to run assistant:", error);
      throw error;
    }
  }
}

export const aiApiService = AIApiService.getInstance();
