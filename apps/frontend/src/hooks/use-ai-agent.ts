import { useState, useCallback, useEffect } from 'react';
import { AgentFactory } from '../lib/ai-agents/agent-factory';
import type { 
  AIMessage, 
  PracticeMetrics, 
  GenerationOptions,
  AIResponse 
} from '../lib/ai-agents/types';

export const useAIAgent = (metrics: PracticeMetrics) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentFactory, setAgentFactory] = useState<AgentFactory | null>(null);

  useEffect(() => {
    const factory = AgentFactory.getInstance();
    factory.updateMetrics(metrics);
    setAgentFactory(factory);
  }, [metrics]);

  const sendMessage = useCallback(async (
    content: string,
    options?: GenerationOptions
  ) => {
    if (!agentFactory) {
      setError('Agent system not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Use the head brain agent to process the query
      const headBrain = agentFactory.createAgent('head-brain');
      const response = await headBrain.processQuery(content);
      
      // Add AI response
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        metadata: {
          ...response.metadata,
          agentId: 'head-brain'
        }
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in AI response:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agentFactory]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
