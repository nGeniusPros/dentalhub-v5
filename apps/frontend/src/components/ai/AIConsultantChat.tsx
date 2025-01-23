import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { useAIAgent } from '../../hooks/use-ai-agent';
import { AgentGrid } from './AgentGrid';
import { AIErrorBoundary } from './AIErrorBoundary';
import { cn } from '@/lib/utils';
import { PracticeMetrics } from '../../lib/ai-agents/types/frontend-types';

interface AIConsultantChatProps {
  selectedQuestion?: string;
  metrics?: PracticeMetrics;
  agentPresence?: Array<{
    id: string;
    name: string;
    status: 'active'|'idle'|'processing';
  }>;
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  selectedQuestion,
  agentPresence = [],
  metrics = {
    monthlyRevenue: 150000,
    patientCount: 1200,
    appointmentRate: 75,
    treatmentAcceptance: 65
  }
}) => {
  const [question, setQuestion] = useState('');
  const [activeAgent, setActiveAgent] = useState<string>('head-brain');
  const [isGridVisible, setIsGridVisible] = useState(false);
  const { messages, isLoading, error, sendMessage } = useAIAgent(metrics);

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    await sendMessage(question);
    setQuestion('');
  };

  return (
    <AIErrorBoundary
      onReset={() => {
        setQuestion('');
        setIsGridVisible(false);
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "p-4 rounded-lg",
                  message.role === 'user' 
                    ? "bg-primary/10 ml-12" 
                    : "bg-muted mr-12"
                )}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'user' ? (
                    <Icons.User className="h-6 w-6" />
                  ) : (
                    <Icons.Bot className="h-6 w-6" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    {message.metadata?.sources && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Sources: {message.metadata.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your dental practice consultant..."
              className="flex-1 bg-background rounded-md border px-3 py-2"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Icons.Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsGridVisible(!isGridVisible)}
            >
              <Icons.Grid className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <AnimatePresence>
          {isGridVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t"
            >
              <AgentGrid
                agents={agentPresence}
                activeAgent={activeAgent}
                onAgentSelect={setActiveAgent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AIErrorBoundary>
  );
};