import axios from 'axios';
import { TokenResponse, TokenInfo } from './types';
import { SikkaAuthenticationError, SikkaTimeoutError, handleSikkaError } from './error';

interface TokenServiceInfo {
  requestKey: string;
  refreshKey?: string;
  expiresAt: Date;
  scope: string[];
}

interface SikkaConfig {
  baseUrl: string;
  appId: string;
  appKey: string;
  practiceId: string;
}

interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (error: any) => void;
}

export default class SikkaTokenService {
  private currentToken: TokenServiceInfo | null = null;
  private refreshPromise: Promise<TokenServiceInfo> | null = null;
  private requestQueue: QueuedRequest[] = [];
  private refreshAttempts: number = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 3;
  private readonly REFRESH_COOLDOWN = 1000; // 1 second

  constructor(private config: SikkaConfig) {}

  public async getAccessToken(): Promise<string> {
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
    } catch (error) {
      // If refresh fails, reject all queued requests
      this.rejectQueue(error);
      throw error;
    }
  }

  public async refreshToken(): Promise<TokenServiceInfo> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
      const error = new SikkaAuthenticationError(
        'Maximum token refresh attempts exceeded',
        { attempts: this.refreshAttempts }
      );
      this.rejectQueue(error);
      throw error;
    }

    try {
      this.refreshPromise = this.performTokenRefresh();
      const tokenInfo = await this.refreshPromise;
      this.currentToken = tokenInfo;
      this.refreshAttempts = 0; // Reset attempts on success
      this.resolveQueue(tokenInfo.requestKey);
      return tokenInfo;
    } catch (error) {
      this.refreshAttempts++;
      // Add exponential backoff
      if (this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
        const delay = this.REFRESH_COOLDOWN * Math.pow(2, this.refreshAttempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<TokenServiceInfo> {
    try {
      const requestData = {
        app_id: this.config.appId,
        app_key: this.config.appKey,
        practice_id: this.config.practiceId,
      };
      
      console.log('Sikka Token Request:', requestData);

      const response = await axios.post<TokenResponse>(
        `${this.config.baseUrl}/request_key`,
        requestData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response
      console.log('Sikka Token Response:', response.data);

      // Parse expires_in from response
      let expiresInMinutes = 60; // Default to 60 minutes if parsing fails
      if (response.data.expires_in) {
        const match = response.data.expires_in.match(/(\d+)/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          expiresInMinutes = minutes;
        }
      }

      // Parse scope into array
      const scope = response.data.scope ? response.data.scope.split(' ') : [];

      return {
        requestKey: response.data.request_key,
        refreshKey: response.data.refresh_key,
        expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
        scope: scope,
      };
    } catch (error) {
      throw handleSikkaError(error);
    }
  }

  private resolveQueue(token: string): void {
    this.requestQueue.forEach(request => request.resolve(token));
    this.requestQueue = [];
  }

  private rejectQueue(error: any): void {
    this.requestQueue.forEach(request => request.reject(error));
    this.requestQueue = [];
  }
}