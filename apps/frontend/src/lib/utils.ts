import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "../types";
import { Session } from "@supabase/supabase-js";
import {
  SikkaVerifyInsuranceResponse,
  SikkaCheckEligibilityResponse,
  SikkaVerifyBenefitsResponse,
  SikkaProcessClaimResponse,
  RetellCallStatusResponse,
  RetellTranscriptionResponse,
  RetellAnalysisResponse,
  OpenAICompletionResponse,
} from "../types/api";
import type { Patient, Appointment, Staff } from "../types/models";
import type { PaginatedResponse } from "../types/utils/helpers";
import type {
  ExternalServiceError,
  RateLimitError,
  AuthenticationError,
} from "../types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const convertSupabaseUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.full_name || "",
    role: supabaseUser.user_metadata?.role || "patient",
    title: supabaseUser.user_metadata?.title || "",
    department: supabaseUser.user_metadata?.department || "",
  };
};

export function isSikkaVerifyInsuranceResponse(
  response: any,
): response is SikkaVerifyInsuranceResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.status === "string"
  );
}

export function isSikkaCheckEligibilityResponse(
  response: any,
): response is SikkaCheckEligibilityResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.status === "string"
  );
}

export function isSikkaVerifyBenefitsResponse(
  response: any,
): response is SikkaVerifyBenefitsResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.status === "string"
  );
}

export function isSikkaProcessClaimResponse(
  response: any,
): response is SikkaProcessClaimResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.status === "string"
  );
}

export function isRetellCallStatusResponse(
  response: any,
): response is RetellCallStatusResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.status === "string"
  );
}

export function isRetellTranscriptionResponse(
  response: any,
): response is RetellTranscriptionResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.transcription === "string"
  );
}

export function isRetellAnalysisResponse(
  response: any,
): response is RetellAnalysisResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.analysis !== "undefined"
  );
}

export function isOpenAICompletionResponse(
  response: any,
): response is OpenAICompletionResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.id === "string" &&
    typeof response.object === "string" &&
    typeof response.created === "number" &&
    typeof response.model === "string" &&
    Array.isArray(response.choices)
  );
}

export function isPatient(obj: any): obj is Patient {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    typeof obj.email === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.dateOfBirth === "string" &&
    typeof obj.gender === "string" &&
    typeof obj.address === "string"
  );
}

export function isAppointment(obj: any): obj is Appointment {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.patientId === "string" &&
    typeof obj.staffId === "string" &&
    typeof obj.date === "string" &&
    typeof obj.time === "string" &&
    typeof obj.duration === "number" &&
    typeof obj.status === "string"
  );
}

export function isStaff(obj: any): obj is Staff {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    typeof obj.email === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.role === "string" &&
    typeof obj.department === "string"
  );
}

export function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.name === "string" &&
    typeof obj.role === "string"
  );
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Array.isArray(obj.data) &&
    typeof obj.total === "number" &&
    typeof obj.page === "number" &&
    typeof obj.pageSize === "number"
  );
}

export function isExternalServiceError(obj: any): obj is ExternalServiceError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.service === "string" &&
    (typeof obj.statusCode === "number" ||
      typeof obj.statusCode === "undefined") &&
    typeof obj.message === "string" &&
    typeof obj.details !== "undefined"
  );
}

export function isRateLimitError(obj: any): obj is RateLimitError {
  return (
    typeof obj === "object" && obj !== null && typeof obj.message === "string"
  );
}

export function isAuthenticationError(obj: any): obj is AuthenticationError {
  return (
    typeof obj === "object" && obj !== null && typeof obj.message === "string"
  );
}
