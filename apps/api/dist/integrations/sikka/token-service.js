import axios from 'axios';
import { SikkaAuthenticationError, SikkaRateLimitError, handleSikkaError } from './error';
export default class SikkaTokenService {
    constructor(config) {
        this.config = config;
        this.currentToken = null;
        this.refreshPromise = null;
        this.requestQueue = [];
        this.refreshAttempts = 0;
        this.metrics = {
            refreshAttempts: 0,
            lastRefreshTime: new Date(),
            rateLimitHits: 0,
            totalRefreshes: 0,
            failedRefreshes: 0,
            averageRefreshTime: 0
        };
        this.refreshTimer = null;
        this.REFRESH_COOLDOWN = 1000; // 1 second
        this.MAX_REFRESH_ATTEMPTS = config.maxRetryAttempts ?? 3;
        this.TOKEN_REFRESH_THRESHOLD = config.tokenRefreshThreshold ?? 5;
        this.RATE_LIMIT_DELAY = config.rateLimitDelay ?? 5000;
    }
    async getAccessToken() {
        // Check if token is revoked
        if (this.currentToken?.isRevoked) {
            throw new SikkaAuthenticationError('Token has been revoked');
        }
        // Check if token needs refresh
        if (this.shouldRefreshToken()) {
            return this.refreshToken().then(token => token.requestKey);
        }
        // If token is valid, return it immediately
        if (this.currentToken && this.currentToken.expiresAt > new Date()) {
            return this.currentToken.requestKey;
        }
        // If a refresh is in progress, queue this request
        if (this.refreshPromise) {
            return new Promise((resolve, reject) => {
                this.requestQueue.push({ resolve, reject });
            });
        }
        // Start a new refresh
        try {
            const tokenInfo = await this.refreshToken();
            return tokenInfo.requestKey;
        }
        catch (error) {
            if (error instanceof SikkaRateLimitError) {
                this.metrics.rateLimitHits++;
                await this.handleRateLimit();
                return this.getAccessToken();
            }
            this.rejectQueue(error);
            throw error;
        }
    }
    async refreshToken() {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }
        const startTime = Date.now();
        if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
            const error = new SikkaAuthenticationError('Maximum token refresh attempts exceeded', { attempts: this.refreshAttempts });
            this.metrics.failedRefreshes++;
            this.rejectQueue(error);
            throw error;
        }
        try {
            this.refreshPromise = this.performTokenRefresh();
            const tokenInfo = await this.refreshPromise;
            // Update metrics
            this.metrics.totalRefreshes++;
            this.metrics.lastRefreshTime = new Date();
            this.metrics.averageRefreshTime =
                (this.metrics.averageRefreshTime * (this.metrics.totalRefreshes - 1) +
                    (Date.now() - startTime)) / this.metrics.totalRefreshes;
            this.currentToken = tokenInfo;
            this.refreshAttempts = 0;
            this.scheduleTokenRefresh();
            this.resolveQueue(tokenInfo.requestKey);
            return tokenInfo;
        }
        catch (error) {
            this.refreshAttempts++;
            this.metrics.refreshAttempts++;
            if (error instanceof SikkaRateLimitError) {
                this.metrics.rateLimitHits++;
                await this.handleRateLimit();
                return this.refreshToken();
            }
            if (this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
                const delay = this.REFRESH_COOLDOWN * Math.pow(2, this.refreshAttempts - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            throw error;
        }
        finally {
            this.refreshPromise = null;
        }
    }
    getTokenStatus() {
        if (!this.currentToken) {
            return {
                isValid: false,
                isExpired: true,
                isRevoked: false,
                expiresIn: 0,
                metrics: { ...this.metrics }
            };
        }
        const now = new Date();
        const expiresIn = Math.max(0, Math.floor((this.currentToken.expiresAt.getTime() - now.getTime()) / (60 * 1000)));
        return {
            isValid: !this.currentToken.isRevoked && expiresIn > 0,
            isExpired: expiresIn <= 0,
            isRevoked: !!this.currentToken.isRevoked,
            expiresIn,
            metrics: { ...this.metrics }
        };
    }
    async performTokenRefresh() {
        try {
            const requestData = {
                app_id: this.config.appId,
                app_key: this.config.appKey,
                practice_id: this.config.practiceId,
                master_customer_id: this.config.masterCustomerId,
                practice_key: this.config.practiceKey
            };
            const response = await axios.post(`${this.config.baseUrl}/request_key`, requestData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let expiresInMinutes = 60;
            if (response.data.expires_in) {
                const match = response.data.expires_in.match(/(\d+)/);
                if (match) {
                    expiresInMinutes = parseInt(match[1], 10);
                }
            }
            const scope = response.data.scope ? response.data.scope.split(' ') : [];
            return {
                requestKey: response.data.request_key,
                refreshKey: response.data.refresh_key,
                expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
                scope: scope,
                isRevoked: false
            };
        }
        catch (error) {
            throw handleSikkaError(error);
        }
    }
    shouldRefreshToken() {
        if (!this.currentToken || this.currentToken.isRevoked) {
            return true;
        }
        const now = new Date();
        const minutesUntilExpiration = (this.currentToken.expiresAt.getTime() - now.getTime()) / (60 * 1000);
        return minutesUntilExpiration <= this.TOKEN_REFRESH_THRESHOLD;
    }
    scheduleTokenRefresh() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        if (!this.currentToken || this.currentToken.isRevoked) {
            return;
        }
        const now = new Date();
        const refreshTime = new Date(this.currentToken.expiresAt.getTime() -
            (this.TOKEN_REFRESH_THRESHOLD * 60 * 1000));
        const delay = Math.max(0, refreshTime.getTime() - now.getTime());
        this.refreshTimer = setTimeout(() => {
            this.refreshToken().catch(error => {
                console.error('Scheduled token refresh failed:', error);
            });
        }, delay);
    }
    async handleRateLimit() {
        await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
    }
    resolveQueue(token) {
        this.requestQueue.forEach(request => request.resolve(token));
        this.requestQueue = [];
    }
    rejectQueue(error) {
        this.requestQueue.forEach(request => request.reject(error));
        this.requestQueue = [];
    }
    dispose() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
    }
}
