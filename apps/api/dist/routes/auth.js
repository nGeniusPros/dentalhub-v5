import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
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
router.post('/login', async (req, res) => {
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
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.post('/refresh', async (req, res) => {
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
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: session?.expires_in
        });
        res.cookie('refresh_token', session?.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
        });
        return res.status(200).json({ message: 'Session refreshed successfully' });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
export { router as authRoutes };
