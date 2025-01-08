import { Router, Request, Response } from 'express';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { z } from 'zod';
import { createAuthService } from '../services/authService';
import { createRetellClient } from '../services/retellClient';
import { createSikkaClient } from '../integrations/sikka';
import { MonitoringService } from '../services/monitoring';
import { config } from 'dotenv';

// Load environment variables
config();

const router = Router();

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Validation schema for refresh token
const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

const isProduction = process.env.NODE_ENV === 'production';

router.post('/login', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const authService = new AuthService(req.supabase);
    const { user, accessToken, refreshToken, error } = await authService.login(email, password);

    if (error) {
      console.error('Error during login:', error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Set cookies with the access token and refresh token
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction, // Set the 'secure' flag based on the environment
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction, // Set the 'secure' flag based on the environment
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
    });

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/refresh', async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
  try {
    const { refresh_token } = refreshTokenSchema.parse(req.cookies);

    const authService = new AuthService(req.supabase);

    const { session, error } = await authService.refreshSession(refresh_token);
    if (error) {
      console.error('Session refresh error:', error);
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.cookie('access_token', session?.access_token, {
      httpOnly: true,
      secure: isProduction, // Set the 'secure' flag based on the environment
      sameSite: 'strict',
      path: '/',
      maxAge: session?.expires_in
    });

    res.cookie('refresh_token', session?.refresh_token, {
      httpOnly: true,
      secure: isProduction, // Set the 'secure' flag based on the environment
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
    });

    return res.status(200).json({ message: 'Session refreshed successfully' });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});


// Example of using the factories to create clients
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const retellClient = createRetellClient({
  apiKey: process.env.RETELL_API_KEY!,
  apiBaseUrl: process.env.RETELL_API_BASE_URL!,
});

const sikkaClient = createSikkaClient({
  apiKey: process.env.SIKKA_API_KEY!,
  apiBaseUrl: process.env.SIKKA_API_BASE_URL!,
});

export { router as authRoutes };