import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '../types';
import { Session } from '@supabase/supabase-js';
import {
  SikkaVerifyInsuranceResponse,
  SikkaCheckEligibilityResponse,
  SikkaVerifyBenefitsResponse,
  SikkaProcessClaimResponse,
  RetellCallStatusResponse,
  RetellTranscriptionResponse,
  RetellAnalysisResponse,
  OpenAICompletionResponse,
} from '../types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const convertSupabaseUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || '',
    role: supabaseUser.user_metadata?.role || 'patient',
    title: supabaseUser.user_metadata?.title || '',
    department: supabaseUser.user_metadata?.department || '',
  };
};

export function isSikkaVerifyInsuranceResponse(
  response: any
): response is SikkaVerifyInsuranceResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.status === 'string'
  );
}

export function isSikkaCheckEligibilityResponse(
  response: any
): response is SikkaCheckEligibilityResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.status === 'string'
  );
}

export function isSikkaVerifyBenefitsResponse(
  response: any
): response is SikkaVerifyBenefitsResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.status === 'string'
  );
}

export function isSikkaProcessClaimResponse(
  response: any
): response is SikkaProcessClaimResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.status === 'string'
  );
}

export function isRetellCallStatusResponse(
  response: any
): response is RetellCallStatusResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.status === 'string'
  );
}

export function isRetellTranscriptionResponse(
  response: any
): response is RetellTranscriptionResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.transcription === 'string'
  );
}

export function isRetellAnalysisResponse(
  response: any
): response is RetellAnalysisResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.analysis !== 'undefined'
  );
}

export function isOpenAICompletionResponse(
  response: any
): response is OpenAICompletionResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.id === 'string' &&
    typeof response.object === 'string' &&
    typeof response.created === 'number' &&
    typeof response.model === 'string' &&
    Array.isArray(response.choices)
  );
}