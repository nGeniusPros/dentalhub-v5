import { apiClient } from '../../config/api';

export interface RequestConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
}

export class RequestManager {
  private static instance: RequestManager;
  private baseURL: string;

  private constructor() {
    this.baseURL = '/api';
  }

  public static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  async makeRequest<T>(config: RequestConfig): Promise<T> {
    try {
      const { endpoint, method = 'GET', data, params } = config;
      const response = await apiClient.request({
        url: endpoint,
        method,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.makeRequest({ endpoint, method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest({ endpoint, method: 'POST', data });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest({ endpoint, method: 'PUT', data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest({ endpoint, method: 'DELETE' });
  }
}
