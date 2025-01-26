import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  VITE_API_URL: z.string().url(),

  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),

  // OpenAI Agents
  VITE_OPENAI_BRAIN_CONSULTANT_ID: z.string().min(1),
  VITE_OPENAI_BRAIN_CONSULTANT_API_KEY: z.string().min(1),
  VITE_OPENAI_MARKETING_COACHING_ID: z.string().min(1),
  VITE_OPENAI_MARKETING_COACHING_API_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse({
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_OPENAI_BRAIN_CONSULTANT_ID: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID,
      VITE_OPENAI_BRAIN_CONSULTANT_API_KEY: import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_API_KEY,
      VITE_OPENAI_MARKETING_COACHING_ID: import.meta.env.VITE_OPENAI_MARKETING_COACHING_ID,
      VITE_OPENAI_MARKETING_COACHING_API_KEY: import.meta.env.VITE_OPENAI_MARKETING_COACHING_API_KEY,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}
