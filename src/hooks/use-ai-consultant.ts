import { useState } from 'react';
import { generateAIResponse } from '../lib/api/openai';
import type { AIConsultantPrompt, AIInsight } from '../lib/types/ai';

export const useAIConsultant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async (prompt: AIConsultantPrompt): Promise<AIInsight | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateAIResponse(prompt);
      
      // Parse and format the AI response into an insight
      const insight: AIInsight = {
        id: Date.now().toString(),
        title: 'AI-Generated Insight',
        description: response || '',
        impact: determineImpact(prompt.metrics),
        category: prompt.focusArea,
        action: 'View Details',
      };

      return insight;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateInsight,
    loading,
    error
  };
};

const determineImpact = (metrics: AIConsultantPrompt['metrics']): AIInsight['impact'] => {
  // Logic to determine impact based on metrics
  if (metrics.appointmentFillRate < 70 || metrics.treatmentAcceptance < 60) {
    return 'high';
  } else if (metrics.appointmentFillRate < 85 || metrics.treatmentAcceptance < 75) {
    return 'medium';
  }
  return 'low';
};