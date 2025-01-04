import { Router, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { asyncHandler } from '../utils/asyncHandler';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

router.post('/login', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const { email, password } = req.body;

  const { data, error } = await req.supabase.auth.signInWithPassword({
    email,
    password,
		});

  if (error) {
    return res.status(401).json({ error: error.message });
		}

  const { data: user, error: userError } = await req.supabase
    .from('users')
    .select('*')
    .eq('id', data.user?.id)
				.single();

  if (userError) {
    return res.status(500).json({ error: userError.message });
		}

		return res.json(user);
}));

router.get('/me', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const { data: user, error } = await req.supabase.auth.getUser();

		if (error) {
				return res.status(500).json({ error: error.message });
		}

		const { data: profile, error: profileError } = await req.supabase
				.from('users')
				.select('*')
				.eq('id', user?.user?.id)
				.single();

		if (profileError) {
				return res.status(500).json({ error: profileError.message });
		}

		return res.json(profile);
}));

router.put('/me', asyncHandler(async (req: Request & { supabase: SupabaseClient<Database> }, res: Response) => {
		const { user_metadata } = req.body;
		const { data: user, error } = await req.supabase.auth.getUser();

		if (error) {
				return res.status(500).json({ error: error.message });
		}

		const { data: profile, error: profileError } = await req.supabase
				.from('users')
				.update({ user_metadata })
				.eq('id', user?.user?.id)
				.select()
				.single();

				if (profileError) {
						return res.status(500).json({ error: profileError.message });
				}

		return res.json(profile);
}));

export default router;