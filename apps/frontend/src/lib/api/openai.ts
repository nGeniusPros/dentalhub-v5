import OpenAI from "openai";
import { AIConsultantPrompt } from "../types/ai";

// Create a mock response generator for development
const generateMockResponse = (prompt: AIConsultantPrompt) => {
  const responses = [
    {
      insight:
        "Based on your current metrics, there's an opportunity to improve treatment acceptance rates through enhanced patient education and communication.",
      recommendations: [
        "Implement visual treatment planning tools",
        "Develop patient education materials",
        "Train staff on communication techniques",
      ],
    },
    {
      insight:
        "Your appointment fill rate indicates potential scheduling optimization opportunities.",
      recommendations: [
        "Review scheduling templates",
        "Implement automated reminders",
        "Develop a cancellation recovery strategy",
      ],
    },
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateAIResponse = async (prompt: AIConsultantPrompt) => {
  // In development, use mock responses
  if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.DEV) {
    const mockResponse = generateMockResponse(prompt);
    return JSON.stringify(mockResponse);
  }

  // In production with API key, use actual OpenAI
  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Note: In production, use backend
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI dental practice consultant with expertise in:
            - Practice management and optimization
            - Revenue analysis and growth strategies
            - Patient care and retention
            - Staff efficiency and scheduling
            - Marketing and patient acquisition
            
            Provide concise, actionable insights based on the practice data and metrics.
            Focus on practical recommendations that can be implemented.`,
        },
        {
          role: "user",
          content: formatPrompt(prompt),
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    // Fallback to mock response in case of error
    return JSON.stringify(generateMockResponse(prompt));
  }
};

const formatPrompt = (prompt: AIConsultantPrompt): string => {
  return `
    Analyze the following practice metrics and provide insights:
    
    Practice Metrics:
    - Monthly Revenue: ${prompt.metrics.monthlyRevenue}
    - Patient Count: ${prompt.metrics.patientCount}
    - Appointment Fill Rate: ${prompt.metrics.appointmentFillRate}%
    - Treatment Acceptance: ${prompt.metrics.treatmentAcceptance}%
    
    Focus Area: ${prompt.focusArea}
    Specific Question: ${prompt.question}
    
    Please provide:
    1. Key insights based on the metrics
    2. Specific recommendations for improvement
    3. Potential impact of implementing recommendations
  `;
};
