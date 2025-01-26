/**
 * Common type definitions used across the DentalHub application
 */

export type ISO8601String = string;
export type UUID = string;

export interface Timestamps {
  created_at: ISO8601String;
  updated_at: ISO8601String;
}

export interface ApiResponseMeta {
  timestamp: ISO8601String;
  requestId: UUID;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiResponseMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiResponseMeta & PaginationMeta;
}

export interface ErrorDetails {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  docs?: string;
  resolution?: string;
  reference?: string;
  issues?: ErrorDetails[];
}

export type UserRole = "admin" | "dentist" | "hygienist" | "staff";
