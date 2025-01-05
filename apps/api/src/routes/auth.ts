import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';

const router: ExpressRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
		password: z.string().min(6),
});

const updateMeSchema = z.object({
  user_metadata: z.any().optional(),
});

const refreshTokenSchema = z.object({
	refresh_token: z.string().min(1),
});

const refreshCookieSchema = z.object({
		refresh_token: z.string().min(1),
});

router.post('/login', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
	const validationResult = loginSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ error: 'Invalid email or password' });
	}

		const { email, password } = validationResult.data;
		const authService = new AuthService(req.supabase);

		try {
			const { user, session } = await authService.login(email, password);
				res.cookie('access_token', session?.access_token, { httpOnly: true, secure: true });
				res.cookie('refresh_token', session?.refresh_token, { httpOnly: true, secure: true });
			return res.json(user);
	} catch (error) {
				return res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
		}
}));

router.get('/me', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
	const authService = new AuthService(req.supabase);
		try {
				const profile = await authService.getCurrentUser();
			return res.json(profile);
	} catch (error) {
				return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get current user' });
		}
}));

router.put('/me', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const validationResult = updateMeSchema.safeParse(req.body);
	if (!validationResult.success) {
				return res.status(400).json({ error: 'Invalid user data' });
		}
		const { user_metadata } = validationResult.data;
		const authService = new AuthService(req.supabase);
		try {
				const profile = await authService.updateCurrentUser(user_metadata);
				return res.json(profile);
	} catch (error) {
				return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to update user' });
		}
}));

router.post('/refresh', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const authService = new AuthService(req.supabase);
		const validationResult = refreshCookieSchema.safeParse(req.cookies);
	if (!validationResult.success) {
				return res.status(400).json({ error: 'No refresh token provided' });
		}
		const { refresh_token } = validationResult.data;
		try {
				const { session } = await authService.refreshSession(refresh_token);
				res.cookie('access_token', session?.access_token, { httpOnly: true, secure: true });
				res.cookie('refresh_token', session?.refresh_token, { httpOnly: true, secure: true });
				return res.json({ message: 'Session refreshed successfully' });
	} catch (error) {
				return res.status(401).json({ error: error instanceof Error ? error.message : 'Failed to refresh session' });
		}
}));

export default router;