import OpenAI from 'openai';
import { 
  AgentError, 
  OpenAIError, 
  NetworkError, 
  RateLimitError,
  convertOpenAIError 
} from '../types/errors';
import { DentalAgentType } from '../types/agent-types';
import { sleep, retry, withTimeout, AsyncQueue } from '../utils/async';

interface OpenAIConfig {
  assistantId: string;
  apiKey: string;
  maxRetries?: number;
  timeout?: number;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private clients = new Map<string, OpenAI>();
  private requestQueue = new AsyncQueue();

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private getClient(apiKey: string): OpenAI {
    let client = this.clients.get(apiKey);
    if (!client) {
      client = new OpenAI({ 
        apiKey,
        timeout: 30000,
        maxRetries: 0 // We handle retries ourselves
      });
      this.clients.set(apiKey, client);
    }
    return client;
  }

  async generateResponse(
    prompt: string,
    config: OpenAIConfig,
    agentType: DentalAgentType
  ): Promise<string> {
    // Queue the request to prevent concurrent API calls
    let result: string = '';
    await this.requestQueue.add(async () => {
      result = await retry(
        async () => {
          return await withTimeout(
            async () => this.makeRequest(prompt, config, agentType),
            config.timeout || 60000
          );
        },
        config.maxRetries || 3
      );
    });
    return result;
  }

  private async makeRequest(
    prompt: string,
    config: OpenAIConfig,
    agentType: DentalAgentType
  ): Promise<string> {
    try {
      const client = this.getClient(config.apiKey);
      
      // Create a thread
      const thread = await client.beta.threads.create();

      // Add the message to the thread
      await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: prompt
      });

      // Run the assistant
      const run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: config.assistantId
      });

      // Wait for completion
      await this.waitForCompletion(client, thread.id, run.id);
      
      // Get the messages
      const messages = await client.beta.threads.messages.list(thread.id);
      
      // Return the last assistant message
      const lastMessage = messages.data
        .filter(msg => msg.role === 'assistant')
        .pop();

      if (!lastMessage?.content[0]) {
        throw new Error('No response received from assistant');
      }

      return lastMessage.content[0].text.value;

    } catch (error: any) {
      if (error instanceof AgentError) {
        throw error;
      }

      // Network or unexpected errors
      if (!error.response) {
        throw new NetworkError(agentType, error.message);
      }

      // Convert OpenAI errors to our error types
      throw convertOpenAIError(error, agentType);
    }
  }

  private async waitForCompletion(
    client: OpenAI,
    threadId: string,
    runId: string,
    maxAttempts: number = 60,
    interval: number = 1000
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const run = await client.beta.threads.runs.retrieve(threadId, runId);
      
      if (run.status === 'completed') {
        return;
      }
      
      if (run.status === 'failed') {
        throw new Error(run.last_error?.message || 'Run failed');
      }

      if (run.status === 'cancelled') {
        throw new Error('Run was cancelled');
      }
      
      await sleep(interval);
    }
    
    throw new Error('Operation timed out');
  }
}
