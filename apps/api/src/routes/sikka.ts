import { Router, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/auth';
import { getPracticeInfo } from '../integrations/sikka/service';
import SikkaTokenService from '../integrations/sikka/token-service';
import { sikkaConfig } from '../integrations/sikka/config';
import { AuthResponse } from '../types/auth';

const router: Router = Router();
const tokenManager = new SikkaTokenService({
  baseUrl: sikkaConfig.baseUrl,
  appId: sikkaConfig.appId,
  appKey: sikkaConfig.appKey,
  practiceId: sikkaConfig.practiceId,
});

// Health check route that verifies Sikka API connectivity and token management
router.get('/health', asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // First, ensure we have a valid token
    const token = await tokenManager.getAccessToken();

    // Then get practice info as a real API test
    const practiceInfo = await getPracticeInfo();

    return res.json({
      status: 'healthy',
      token_status: 'valid',
      token: token,
      practice_info: practiceInfo,
      api_version: 'v4',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Sikka Health Check Error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    return res.status(503).json({
      status: 'unhealthy',
      error: {
        message: error?.message || 'Failed to connect to Sikka API',
        details: error.response?.data,
        status_code: error.response?.status,
        timestamp: new Date().toISOString()
      }
    });
  }
}));

// Force token refresh
router.post('/refresh-token', asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const token = await tokenManager.refreshToken();
    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Failed to refresh token'
    });
  }
}));

export default router;