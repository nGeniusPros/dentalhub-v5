import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { useAIConsultant } from "../../hooks/use-ai-consultant";
import type { AIConsultantPrompt } from "../../lib/types/ai";
import { AgentFactory } from "../../lib/ai-agents/factory/agent-factory";
import type { AgentMessage, AgentContext } from "../../lib/ai-agents/types/agent-types";

interface AIConsultantChatProps {
  selectedQuestion?: string;
  practiceMetrics?: AgentContext["practiceMetrics"];
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  selectedQuestion,
  practiceMetrics,
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const { loading, error } = useAIConsultant();

  const agentFactory = AgentFactory.getInstance();
  const brainConsultant = agentFactory.getAgent("BRAIN_CONSULTANT");

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  useEffect(() => {
    if (practiceMetrics) {
      agentFactory.updateContext({
        practiceMetrics,
        sessionData: {
          startTime: new Date().toISOString(),
          interactions: 0,
          lastInteraction: new Date().toISOString(),
        },
      });
    }
  }, [practiceMetrics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || thinking) return;

    const userMessage: AgentMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setThinking(true);

    try {
      const response = await brainConsultant.processMessage(question);

      const assistantMessage: AgentMessage = {
        role: "assistant",
        content: response.content,
        timestamp: new Date().toISOString(),
        metadata: response.metadata,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update agent context with new interaction
      agentFactory.updateContext({
        sessionData: {
          interactions: messages.length + 2,
          lastInteraction: new Date().toISOString(),
        },
      });
    } catch (err) {
      const errorMessage: AgentMessage = {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
        metadata: {
          error: err instanceof Error ? err.message : "Unknown error occurred",
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setThinking(false);
      setQuestion("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-primary text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <Icons.Brain className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI Practice Consultant</h3>
            <p className="text-sm opacity-80">
              Ask me anything about your practice
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-white ml-4"
                    : "bg-gray-100 text-gray-900 mr-4"
                }`}
              >
                {message.content}
                {message.metadata?.recommendations && (
                  <div className="mt-2 text-sm">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {(message.metadata.recommendations as string[]).map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg flex items-center gap-2">
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full pr-24 pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={thinking}
          />
          <Button
            type="submit"
            disabled={!question.trim() || thinking}
            className="absolute right-1 top-1 bg-primary text-white hover:bg-primary/90"
          >
            {thinking ? (
              <Icons.Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icons.Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
