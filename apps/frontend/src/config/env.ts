import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  API_BASE_URL: z.string().url(),
  
  // Supabase Configuration
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  
  // Retell Configuration
  RETELL_BASE_URL: z.string().url().optional(),
  RETELL_WEBSOCKET_URL: z.string().url().optional(),
  RETELL_API_KEY: z.string().optional(),
  
  // OpenAI Agents Configuration
  OPENAI_AGENTS: z.object({
    BRAIN_CONSULTANT: z.object({
      ID: z.string(),
      API_KEY: z.string()
    }),
    MARKETING_COACHING: z.object({
      ID: z.string(),
      API_KEY: z.string()
    }),
    DATA_RETRIEVAL: z.object({
      ID: z.string(),
      API_KEY: z.string()
    }),
    // ... other agents
  }).optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const getEnvVar = (key: string): string => {
  const value = import.meta.env[`VITE_${key}`] || process.env[`NEXT_PUBLIC_${key}`];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  API_BASE_URL: getEnvVar('API_BASE_URL'),
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  RETELL_BASE_URL: import.meta.env.VITE_RETELL_BASE_URL,
  RETELL_WEBSOCKET_URL: import.meta.env.VITE_RETELL_WEBSOCKET_URL,
  RETELL_API_KEY: import.meta.env.VITE_RETELL_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENAI_AGENTS: {
    BRAIN_CONSULTANT: {
      ID: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID,
      API_KEY: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_API_KEY
    },
    // Add other agents as needed
  }
} as const;

// Validate environment variables
envSchema.parse(env);
