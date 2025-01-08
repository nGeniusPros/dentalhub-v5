import express, { Request, Response, Router, RequestHandler } from 'express';
import { getRequestKey, getPaginatedData } from '../services/sikkaApi';
import { supabase } from '../utils/supabase.js';
import { z } from 'zod';

const router = Router();

const envSchema = z.object({
  SIKKA_APP_ID: z.string(),
  SIKKA_APP_KEY: z.string(),
  SIKKA_P1_MASTER_CUSTOMER_ID: z.string(),
  SIKKA_P1_PRACTICE_ID: z.string(),
  SIKKA_P1_PRACTICE_KEY: z.string(),
});

interface ApiResponse {
  message?: string;
  error?: string;
}

const getProvidersHandler: RequestHandler<{}, ApiResponse> = async (req, res) => {
  try {
    const env = envSchema.parse(process.env);

    const requestKey = await getRequestKey(
      env.SIKKA_APP_ID,
      env.SIKKA_APP_KEY,
      env.SIKKA_P1_MASTER_CUSTOMER_ID,
      env.SIKKA_P1_PRACTICE_KEY
    );

    const providers = await getPaginatedData(
      requestKey,
      env.SIKKA_P1_PRACTICE_ID,
      'providers',
      'provider_id,practice_id,provider_type,firstname,lastname,national_provider_identifier,status,is_user'
    );

    // TODO: Add data transformation and Supabase insertion
    console.log('Providers:', providers);

    res.json({ message: 'Providers data fetched successfully' });
  } catch (error: any) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: error.message });
  }
};

router.get('/', getProvidersHandler);

export default router;