import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { useAIAgent } from '../../hooks/use-ai-agent';
import { AgentGrid } from './AgentGrid';
import { cn } from '@/lib/utils';
import type { PracticeMetrics } from '../../lib/ai-agents/types';

interface AIConsultantChatProps {
  selectedQuestion?: string;
  metrics?: PracticeMetrics;
  agentPresence?: Array<{
    id: string;
    name: string;
    status: 'active'|'idle'|'processing';
  }>;
}

type ChatMessage = {
  role: 'user' | 'assistant' | 'agent';
  content: string;
  metadata?: {
    agentId?: string;
    confidence?: number;
    timestamp: string;
    sources?: string[];
  };
};

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

  const handleAgentSelect = (agentId: string) => {
    setActiveAgent(agentId);
    setIsGridVisible(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-navy-light">
        <div className="flex items-center gap-3">
          <Icons.Brain className="w-6 h-6 text-turquoise" />
          <div>
            <h3 className="font-semibold text-gray-light">Head Practice Consultant</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green" />
              <p className="text-sm text-gray">Online - Ready to assist</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isGridVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-navy-light"
          >
            <AgentGrid onAgentSelect={handleAgentSelect} activeAgent={activeAgent} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4",
        "scrollbar-thin scrollbar-thumb-navy-light scrollbar-track-transparent"
      )}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center mr-2">
                  <Icons.Brain className="w-4 h-4 text-turquoise" />
                </div>
              )}
              <motion.div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg relative group",
                  message.role === 'user'
                    ? "bg-gradient-ocean text-white"
                    : "bg-navy text-gray-light"
                )}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="pr-8">
                  {message.content}
                  {message.metadata && (
                    <div className="mt-2 pt-2 border-t border-navy-light text-xs space-y-1">
                      {message.metadata.agentId && (
                        <div className="flex items-center gap-1 text-gray">
                          <Icons.User2 className="w-3 h-3" />
                          <span>{message.metadata.agentId}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray">
                        <Icons.Clock className="w-3 h-3" />
                        <span>{new Date(message.metadata.timestamp).toLocaleTimeString()}</span>
                        {message.metadata.confidence && (
                          <>
                            <Icons.Gauge className="w-3 h-3" />
                            <span>{Math.round(message.metadata.confidence * 100)}% confidence</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 hover:bg-navy-light rounded"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                  >
                    <Icons.Copy className="w-4 h-4 text-gray" />
                  </button>
                </div>
              </motion.div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-ocean flex items-center justify-center ml-2">
                  <Icons.User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center mr-2">
                <Icons.Brain className="w-4 h-4 text-turquoise" />
              </div>
              <div className="bg-navy text-gray-light p-3 rounded-lg flex items-center space-x-2">
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center space-x-2">
                <Icons.AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-navy-light">
        <div className="relative space-y-2">
          <AnimatePresence>
            {agentPresence.some(a => a.status === 'processing') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full mb-2 left-0 right-0 flex justify-center gap-1.5"
              >
                {agentPresence
                  .filter(a => a.status === 'processing')
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1.5"
                    >
                      <Icons.Bot className="w-4 h-4 animate-pulse" />
                      <span>{agent.name}</span>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your practice performance..."
            className="w-full p-3 pr-12 rounded-lg bg-navy text-gray-light placeholder-gray-dark border-none focus:ring-2 focus:ring-turquoise"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg",
              "bg-gradient-ocean text-white hover:opacity-90 disabled:opacity-50"
            )}
          >
            <Icons.Send className="w-4 h-4" />
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsGridVisible(!isGridVisible)}
            className="text-gray-500 hover:text-primary absolute right-12 top-1/2 -translate-y-1/2"
          >
            <Icons.Grid className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};