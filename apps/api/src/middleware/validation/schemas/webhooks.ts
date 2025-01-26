import { z } from "zod";
import { ISO8601String } from "@dentalhub/types";

// Common Types
const iso8601Schema = z.string().refine((value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
}, "Invalid ISO 8601 date string");

// Retell Schemas
const retellBaseSchema = z.object({
  eventType: z.string(),
  callId: z.string(),
  timestamp: iso8601Schema,
});

const retellCallStartedSchema = retellBaseSchema.extend({
  eventType: z.literal("call.started"),
  data: z.object({
    agentId: z.string(),
    customerId: z.string().optional(),
    startTime: iso8601Schema,
    metadata: z.record(z.unknown()).optional(),
  }),
});

const retellCallEndedSchema = retellBaseSchema.extend({
  eventType: z.literal("call.ended"),
  data: z.object({
    duration: z.number(),
    endTime: iso8601Schema,
    reason: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

const retellTranscriptionSchema = retellBaseSchema.extend({
  eventType: z.literal("call.transcription"),
  data: z.object({
    text: z.string(),
    speakerId: z.string(),
    speakerType: z.enum(["agent", "customer"]),
    startTime: iso8601Schema,
    endTime: iso8601Schema,
    metadata: z.record(z.unknown()).optional(),
  }),
});

const retellRecordingSchema = retellBaseSchema.extend({
  eventType: z.literal("call.recording"),
  data: z.object({
    url: z.string().url(),
    duration: z.number(),
    format: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const retellWebhookSchema = z.discriminatedUnion("eventType", [
  retellCallStartedSchema,
  retellCallEndedSchema,
  retellTranscriptionSchema,
  retellRecordingSchema,
]);

// Sikka Schemas
const sikkaBaseSchema = z.object({
  eventType: z.string(),
  timestamp: iso8601Schema,
  practiceId: z.string(),
  requestId: z.string(),
});

const sikkaEligibilityVerifiedSchema = sikkaBaseSchema.extend({
  eventType: z.literal("eligibility.verified"),
  data: z.object({
    patientId: z.string(),
    insuranceId: z.string(),
    status: z.enum(["active", "inactive", "pending"]),
    verificationDate: iso8601Schema,
    coverage: z.object({
      planType: z.string(),
      effectiveDate: iso8601Schema,
      terminationDate: iso8601Schema.optional(),
      coverageDetails: z.array(
        z.object({
          type: z.string(),
          percentage: z.number(),
          remainingBenefit: z.number(),
          annualMaximum: z.number(),
          usedBenefit: z.number(),
          waitingPeriod: z.number().optional(),
          limitations: z.array(z.string()).optional(),
        }),
      ),
    }),
  }),
});

const sikkaClaimStatusSchema = sikkaBaseSchema.extend({
  eventType: z.literal("claim.status_update"),
  data: z.object({
    claimId: z.string(),
    patientId: z.string(),
    status: z.enum([
      "submitted",
      "in_process",
      "approved",
      "denied",
      "partial",
    ]),
    updateDate: iso8601Schema,
    paymentAmount: z.number().optional(),
    denialReason: z.string().optional(),
    remarks: z.string().optional(),
    eob: z
      .object({
        url: z.string().url(),
        documentId: z.string(),
        uploadDate: iso8601Schema,
      })
      .optional(),
  }),
});

const sikkaPreAuthStatusSchema = sikkaBaseSchema.extend({
  eventType: z.literal("preauth.status_update"),
  data: z.object({
    preAuthId: z.string(),
    patientId: z.string(),
    status: z.enum([
      "submitted",
      "in_review",
      "approved",
      "denied",
      "additional_info_needed",
    ]),
    updateDate: iso8601Schema,
    approvedProcedures: z
      .array(
        z.object({
          code: z.string(),
          approved: z.boolean(),
          alternateProcedure: z.string().optional(),
          validityPeriod: z.number().optional(),
          notes: z.string().optional(),
        }),
      )
      .optional(),
    denialReason: z.string().optional(),
    additionalInfoRequired: z.array(z.string()).optional(),
  }),
});

const sikkaBenefitsUpdateSchema = sikkaBaseSchema.extend({
  eventType: z.literal("benefits.update"),
  data: z.object({
    patientId: z.string(),
    insuranceId: z.string(),
    updateDate: iso8601Schema,
    changes: z.array(
      z.object({
        benefitType: z.string(),
        field: z.string(),
        oldValue: z.unknown(),
        newValue: z.unknown(),
        effectiveDate: iso8601Schema,
      }),
    ),
  }),
});

export const sikkaWebhookSchema = z.discriminatedUnion("eventType", [
  sikkaEligibilityVerifiedSchema,
  sikkaClaimStatusSchema,
  sikkaPreAuthStatusSchema,
  sikkaBenefitsUpdateSchema,
]);

// OpenAI Schemas
const openaiBaseSchema = z.object({
  eventType: z.string(),
  timestamp: iso8601Schema,
  organizationId: z.string(),
  modelId: z.string(),
});

const openaiCompletionSchema = openaiBaseSchema.extend({
  eventType: z.literal("completion.finished"),
  data: z.object({
    completionId: z.string(),
    requestId: z.string(),
    model: z.string(),
    choices: z.array(
      z.object({
        text: z.string(),
        index: z.number(),
        finishReason: z.enum(["stop", "length", "content_filter"]),
      }),
    ),
    usage: z.object({
      promptTokens: z.number(),
      completionTokens: z.number(),
      totalTokens: z.number(),
    }),
  }),
});

const openaiErrorSchema = openaiBaseSchema.extend({
  eventType: z.literal("error"),
  data: z.object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      type: z.string(),
      param: z.string().optional(),
    }),
    requestId: z.string(),
  }),
});

const openaiModerationSchema = openaiBaseSchema.extend({
  eventType: z.literal("moderation.flagged"),
  data: z.object({
    requestId: z.string(),
    results: z.array(
      z.object({
        flagged: z.boolean(),
        categories: z.record(z.boolean()),
        categoryScores: z.record(z.number()),
      }),
    ),
  }),
});

export const openaiWebhookSchema = z.discriminatedUnion("eventType", [
  openaiCompletionSchema,
  openaiErrorSchema,
  openaiModerationSchema,
]);
