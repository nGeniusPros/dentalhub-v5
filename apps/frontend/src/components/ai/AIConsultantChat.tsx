import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { useAIConsultant } from "../../hooks/use-ai-consultant";
import type { AIConsultantPrompt } from "../../lib/types/ai";

interface AIConsultantChatProps {
  selectedQuestion?: string;
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  selectedQuestion,
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const { generateInsight, loading, error } = useAIConsultant();

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 150000,
        patientCount: 1200,
        appointmentFillRate: 75,
        treatmentAcceptance: 65,
      },
      focusArea: "operations",
      question: question,
    };

    const insight = await generateInsight(prompt);
    if (insight) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: insight.description,
        },
      ]);
    }

    setQuestion("");
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your practice performance..."
            className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-gray-100"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <Icons.Send className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};
