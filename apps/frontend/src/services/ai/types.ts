import type { GenerationOptions, AIResponse } from '../../lib/ai-agents/types';

export interface AIService {
  generateResponse(
    prompt: string,
    options?: GenerationOptions
  ): Promise<AIResponse>;

  generateStreamingResponse(
    prompt: string,
    options?: GenerationOptions,
    onChunk: (chunk: string) => void
  ): Promise<void>;
}
