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
import { isSikkaVerifyInsuranceResponse, isSikkaCheckEligibilityResponse, isSikkaVerifyBenefitsResponse, isSikkaProcessClaimResponse, isRetellCallStatusResponse, isRetellTranscriptionResponse, isRetellAnalysisResponse, isOpenAICompletionResponse } from '../lib/utils';

const TIMEOUT_MS = 10000;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  organization: process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
});

// Create a custom controller for timeouts
const createTimeoutController = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
};

export const externalService = {
  sikka: {
    verifyInsurance: async (data: any): Promise<SikkaVerifyInsuranceResponse> => {
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
          throw new ExternalServiceError('sikka', response.status, errorData.message || 'Failed to verify insurance with Sikka', errorData);
        }

        const responseData = await response.json();
        if (!isSikkaVerifyInsuranceResponse(responseData)) {
          throw new Error('Invalid Sikka verify insurance response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error verifying insurance with Sikka:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    checkEligibility: async (data: any): Promise<SikkaCheckEligibilityResponse> => {
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
          throw new ExternalServiceError('sikka', response.status, errorData.message || 'Failed to check eligibility with Sikka', errorData);
        }

        const responseData = await response.json();
         if (!isSikkaCheckEligibilityResponse(responseData)) {
          throw new Error('Invalid Sikka check eligibility response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error checking eligibility with Sikka:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    verifyBenefits: async (data: any): Promise<SikkaVerifyBenefitsResponse> => {
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
           throw new ExternalServiceError('sikka', response.status, errorData.message || 'Failed to verify benefits with Sikka', errorData);
        }

        const responseData = await response.json();
        if (!isSikkaVerifyBenefitsResponse(responseData)) {
          throw new Error('Invalid Sikka verify benefits response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error verifying benefits with Sikka:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    processClaim: async (data: any): Promise<SikkaProcessClaimResponse> => {
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
          throw new ExternalServiceError('sikka', response.status, errorData.message || 'Failed to process claim with Sikka', errorData);
        }

        const responseData = await response.json();
        if (!isSikkaProcessClaimResponse(responseData)) {
          throw new Error('Invalid Sikka process claim response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error processing claim with Sikka:', error);
        if (error.name === 'AbortError') {
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
        const response = await fetch(`/api/retell/call-status/${callId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          throw new ExternalServiceError('retell', response.status, errorData.message || 'Failed to get call status from Retell', errorData);
        }

        const responseData = await response.json();
        if (!isRetellCallStatusResponse(responseData)) {
          throw new Error('Invalid Retell call status response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error getting call status from Retell:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    getTranscription: async (callId: string): Promise<RetellTranscriptionResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch(`/api/retell/transcription/${callId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          throw new ExternalServiceError('retell', response.status, errorData.message || 'Failed to get transcription from Retell', errorData);
        }

        const responseData = await response.json();
        if (!isRetellTranscriptionResponse(responseData)) {
          throw new Error('Invalid Retell transcription response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error getting transcription from Retell:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    getAnalysis: async (callId: string): Promise<RetellAnalysisResponse> => {
      const { controller, timeout } = createTimeoutController(TIMEOUT_MS);
      try {
        const response = await fetch(`/api/retell/analysis/${callId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json();
          throw new ExternalServiceError('retell', response.status, errorData.message || 'Failed to get analysis from Retell', errorData);
        }

        const responseData = await response.json();
        if (!isRetellAnalysisResponse(responseData)) {
          throw new Error('Invalid Retell analysis response');
        }
        return responseData;
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Error getting analysis from Retell:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
  },
  openai: {
    generateAppointmentSummary: async (appointmentNotes: string, previousHistory?: string): Promise<string | undefined> => {
      try {
        const prompt = `Summarize the following dental appointment notes and integrate with previous patient history if available:\n\nCurrent Notes: ${appointmentNotes}${
          previousHistory ? `\n\nPrevious History: ${previousHistory}` : ''
        }`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4-0125-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a dental assistant helping to summarize appointment notes and medical history.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }, {
          timeout: TIMEOUT_MS,
        });

        return response.choices[0].message?.content || undefined;
      } catch (error: any) {
        console.error('OpenAI summary generation error:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    analyzeTreatmentEffectiveness: async (
      treatmentData: {
        type: string;
        duration: number;
        outcomes: string[];
        patientFeedback: string;
      },
      similarCases?: Array<Record<string, any>>
    ): Promise<string | undefined> => {
      try {
        const prompt = `Analyze the effectiveness of the following dental treatment and compare with similar cases if available:\n\nCurrent Treatment: ${JSON.stringify(
          treatmentData
        )}${
          similarCases
            ? `\n\nSimilar Cases: ${JSON.stringify(similarCases)}`
            : ''
        }`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4-0125-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a dental analysis assistant helping to evaluate treatment effectiveness.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
        }, {
          timeout: TIMEOUT_MS,
        });

        return response.choices[0].message?.content || undefined;
      } catch (error: any) {
        console.error('OpenAI treatment analysis error:', error);
         if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
  },
};