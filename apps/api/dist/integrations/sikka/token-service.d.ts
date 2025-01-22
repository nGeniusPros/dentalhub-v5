import { TokenStatus, SikkaConfig } from './types';
interface TokenServiceInfo {
    requestKey: string;
    refreshKey?: string;
    expiresAt: Date;
    scope: string[];
    isRevoked?: boolean;
}
export default class SikkaTokenService {
    private config;
    private currentToken;
    private refreshPromise;
    private requestQueue;
    private refreshAttempts;
    private metrics;
    private refreshTimer;
    private readonly MAX_REFRESH_ATTEMPTS;
    private readonly REFRESH_COOLDOWN;
    private readonly TOKEN_REFRESH_THRESHOLD;
    private readonly RATE_LIMIT_DELAY;
    constructor(config: SikkaConfig);
    getAccessToken(): Promise<string>;
    refreshToken(): Promise<TokenServiceInfo>;
    getTokenStatus(): TokenStatus;
    private performTokenRefresh;
    private shouldRefreshToken;
    private scheduleTokenRefresh;
    private handleRateLimit;
    private resolveQueue;
    private rejectQueue;
    dispose(): void;
}
export {};
