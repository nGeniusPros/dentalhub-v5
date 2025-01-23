import { useState, useCallback, useEffect } from 'react';
import { HeadBrainOrchestrator } from '../lib/ai-agents/orchestration/head-brain-orchestrator';
import { AIMessage, PracticeMetrics, GenerationOptions } from '../lib/ai-agents/types/frontend-types';
import { AgentError } from '../lib/ai-agents/types/errors';

export const useAIAgent = (metrics: PracticeMetrics) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orchestrator, setOrchestrator] = useState<HeadBrainOrchestrator | null>(null);

  useEffect(() => {
    const instance = HeadBrainOrchestrator.getInstance();
    setOrchestrator(instance);
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    options?: GenerationOptions
  ) => {
    if (!orchestrator) {
      setError('AI system not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: AIMessage = {
      role: 'user',
      content,
      metadata: {
        timestamp: Date.now()
      }
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await orchestrator.processQuery(content);
      
      // Add AI response
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: result.summary,
        metadata: {
          timestamp: Date.now(),
          agentId: 'BRAIN_CONSULTANT',
          confidence: 1.0,
          sources: result.agentsInvolved,
          metrics: result.metrics as Partial<PracticeMetrics>
        }
      };

      // Add individual agent responses if any
      const agentMessages: AIMessage[] = result.recommendations.map(rec => ({
        role: 'agent',
        content: rec,
        metadata: {
          timestamp: Date.now(),
          agentId: result.agentsInvolved[0]
        }
      }));

      setMessages(prev => [...prev, aiMessage, ...agentMessages]);
    } catch (err) {
      const errorMessage = err instanceof AgentError 
        ? err.message
        : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorAiMessage: AIMessage = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        metadata: {
          timestamp: Date.now(),
          agentId: 'BRAIN_CONSULTANT'
        }
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [orchestrator]);

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
