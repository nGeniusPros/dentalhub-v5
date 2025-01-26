import axios from 'axios';
import { ValidationError } from '../utils/validation';
import { ApiError } from '../utils/error-handling';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific API errors
      const { status, data } = error.response;
      
      if (status === 422) {
        throw new ValidationError(data.errors);
      }

      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      throw new ApiError(
        data.message || 'An error occurred',
        status,
        data.code || 'UNKNOWN_ERROR'
      );
    }

    if (error.request) {
      // Handle network errors
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

// Type-safe API request wrapper
export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  config?: Record<string, unknown>
): Promise<T> => {
  const response = await api.request({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
};

// Reusable API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  insurance: {
    plans: '/insurance/plans',
    providers: '/insurance/providers',
    claims: '/insurance/claims',
    verify: '/insurance/verify-eligibility',
  },
  procedures: {
    codes: '/procedure-codes',
    categories: '/procedure-codes/categories',
    fees: '/procedure-codes/fees',
    import: '/procedure-codes/import',
    export: '/procedure-codes/export',
    validate: '/procedure-codes/validate',
  },
  patients: {
    base: '/patients',
    search: '/patients/search',
    appointments: '/patients/appointments',
    treatments: '/patients/treatments',
  },
} as const;

// Type-safe endpoint helper
export const createEndpoint = <T>(path: string) => ({
  get: (params?: Record<string, unknown>) => apiRequest<T>('get', path, undefined, { params }),
  getById: (id: string) => apiRequest<T>('get', `${path}/${id}`),
  create: (data: Partial<T>) => apiRequest<T>('post', path, data),
  update: (id: string, data: Partial<T>) => apiRequest<T>('patch', `${path}/${id}`, data),
  delete: (id: string) => apiRequest<void>('delete', `${path}/${id}`),
});
