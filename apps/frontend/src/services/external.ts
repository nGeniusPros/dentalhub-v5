import 'openai/shims/node';
import OpenAI from 'openai';
import {
  SikkaVerifyInsuranceResponse,
  SikkaCheckEligibilityResponse,
  SikkaVerifyBenefitsResponse,
  SikkaProcessClaimResponse,
  RetellCallStatusResponse,
  RetellTranscriptionResponse,
  RetellAnalysisResponse,
  OpenAICompletionResponse,
  ExternalServiceError,
  RateLimitError,
  AuthenticationError
} from '../types/api';
import {
  SikkaVerifyInsuranceRequest,
  SikkaCheckEligibilityRequest,
  SikkaVerifyBenefitsRequest,
  SikkaProcessClaimRequest
} from '@dentalhub/types/sikka-requests';
import { isErrorResponse } from '../lib/utils';

const TIMEOUT_MS = 10000;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  organization: process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
});

interface TreatmentAnalysisData {
  type: string;
  duration: number;
  outcomes: string[];
  patientFeedback: string;
  similarCases?: Array<{
    type: string;
    duration: number;
    outcome: string;
    effectiveness: number;
    complications?: string[];
    notes?: string;
  }>;
}

// Create a custom controller for timeouts
const createTimeoutController = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
};

export const externalService = {
  sikka: {
    verifyInsurance: async (data: SikkaVerifyInsuranceRequest): Promise<SikkaVerifyInsuranceResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch('/api/sikka/verify-insurance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('sikka', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to verify insurance with Sikka');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error verifying insurance with Sikka:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },

    checkEligibility: async (data: SikkaCheckEligibilityRequest): Promise<SikkaCheckEligibilityResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch('/api/sikka/check-eligibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('sikka', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to check eligibility with Sikka');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error checking eligibility with Sikka:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },

    verifyBenefits: async (data: SikkaVerifyBenefitsRequest): Promise<SikkaVerifyBenefitsResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch('/api/sikka/verify-benefits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('sikka', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to verify benefits with Sikka');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error verifying benefits with Sikka:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },

    processClaim: async (data: SikkaProcessClaimRequest): Promise<SikkaProcessClaimResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch('/api/sikka/process-claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('sikka', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to process claim with Sikka');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error processing claim with Sikka:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
  },

  retell: {
    getCallStatus: async (callId: string): Promise<RetellCallStatusResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch(`/api/retell/calls/${callId}/status`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('retell', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to get call status from Retell');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error getting call status from Retell:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },

    getTranscription: async (callId: string): Promise<RetellTranscriptionResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch(`/api/retell/calls/${callId}/transcription`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('retell', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to get transcription from Retell');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error getting transcription from Retell:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },

    getAnalysis: async (callId: string): Promise<RetellAnalysisResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch(`/api/retell/calls/${callId}/analysis`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          if (isErrorResponse(errorData)) {
            throw new ExternalServiceError('retell', response.status, errorData.message, errorData.details);
          }
          throw new Error('Failed to get analysis from Retell');
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error getting analysis from Retell:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
  },

  openai: {
    generateAppointmentSummary: async (
      appointmentNotes: string,
      previousHistory?: string
    ): Promise<string | undefined> => {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a dental professional assistant. Summarize the appointment notes in a clear and concise way.',
            },
            {
              role: 'user',
              content: `${previousHistory ? `Previous history: ${previousHistory}\n\n` : ''}Appointment notes: ${appointmentNotes}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        return response.choices[0]?.message?.content;
      } catch (error) {
        console.error('Error generating appointment summary:', error);
        throw error;
      }
    },

    analyzeTreatmentEffectiveness: async (
      data: TreatmentAnalysisData
    ): Promise<string | undefined> => {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a dental treatment analysis assistant. Analyze the effectiveness of the treatment based on the provided data and similar cases.',
            },
            {
              role: 'user',
              content: JSON.stringify(data),
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        return response.choices[0]?.message?.content;
      } catch (error) {
        console.error('Error analyzing treatment effectiveness:', error);
        throw error;
      }
    },
  },
};