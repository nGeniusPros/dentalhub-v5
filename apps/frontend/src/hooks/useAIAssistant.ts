import { useState, useCallback } from 'react';
import { aiApiService } from '../services/ai-api-service';
import { AssistantMessage } from '../lib/ai-agents/types/agent-types';
import { useAi } from './ai-agents/providers/ai-context-provider';

interface UseAIAssistantOptions {
  assistantId: string;
  onError?: (error: Error) => void;
}

interface AIAssistantState {
  messages: AssistantMessage[];
  isLoading: boolean;
  error: Error | null;
  threadId: string | null;
}

export function useAIAssistant({ assistantId, onError }: UseAIAssistantOptions) {
  const [state, setState] = useState<AIAssistantState>({
    messages: [],
    isLoading: false,
    error: null,
    threadId: null,
  });

  const { config } = useAi();

  const initializeThread = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { threadId } = await aiApiService.createThread();
      setState(prev => ({ ...prev, threadId }));
      return threadId;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to initialize thread');
      setState(prev => ({ ...prev, error: err }));
      onError?.(err);
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [onError]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Create thread if it doesn't exist
      let threadId = state.threadId;
      if (!threadId) {
        threadId = await initializeThread();
      }

      // Add message to thread
      await aiApiService.addMessageToThread(threadId, content);

      // Run assistant
      const messages = await aiApiService.runAssistant(threadId, assistantId);

      setState(prev => ({
        ...prev,
        messages,
        threadId,
      }));

      return messages;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to send message');
      setState(prev => ({ ...prev, error: err }));
      onError?.(err);
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.threadId, assistantId, initializeThread, onError]);

  const resetThread = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const threadId = await initializeThread();
      setState(prev => ({
        ...prev,
        messages: [],
        threadId,
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to reset thread');
      setState(prev => ({ ...prev, error: err }));
      onError?.(err);
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [initializeThread, onError]);

  return {
    ...state,
    sendMessage,
    resetThread,
    initializeThread,
  };
}
