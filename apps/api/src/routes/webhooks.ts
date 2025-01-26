import { Router, Request, Response } from 'express';
import { validateWebhookSignature } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@dentalhub/types';
import { 
  RetellWebhookEvent, 
  RetellCallStartedEvent, 
  RetellCallEndedEvent,
  RetellTranscriptionEvent,
  RetellRecordingEvent,
  SikkaWebhookEvent,
  SikkaEligibilityVerifiedEvent,
  SikkaClaimStatusEvent,
  SikkaPreAuthStatusEvent,
  SikkaBenefitsUpdateEvent,
  OpenAIWebhookEvent,
  OpenAICompletionEvent,
  OpenAIErrorEvent,
  OpenAIModeratedEvent
} from '@dentalhub/types';
import { validateRequest, ValidationSchemas } from '../middleware/validation';

const router = Router();

// Retell Webhooks
router.post(
  '/retell',
  validateRequest(ValidationSchemas.retellWebhook),
  validateWebhookSignature,
  asyncHandler(async (req: Request<{}, {}, RetellWebhookEvent>, res: Response) => {
    const event = req.body;

    switch (event.eventType) {
      case 'call.started':
        await handleCallStarted(req.supabase, event);
        break;
      case 'call.ended':
        await handleCallEnded(req.supabase, event);
        break;
      case 'call.transcription':
        await handleTranscription(req.supabase, event);
        break;
      case 'call.recording':
        await handleRecording(req.supabase, event);
        break;
      default:
        throw new Error(`Unhandled Retell event type: ${event.eventType}`);
    }

    res.status(200).send();
  })
);

// Sikka Webhooks
router.post(
  '/sikka',
  validateRequest(ValidationSchemas.sikkaWebhook),
  validateWebhookSignature,
  asyncHandler(async (req: Request<{}, {}, SikkaWebhookEvent>, res: Response) => {
    const event = req.body;

    switch (event.eventType) {
      case 'eligibility.verified':
        await handleEligibilityVerified(req.supabase, event);
        break;
      case 'claim.status_update':
        await handleClaimStatusUpdate(req.supabase, event);
        break;
      case 'preauth.status_update':
        await handlePreAuthStatusUpdate(req.supabase, event);
        break;
      case 'benefits.update':
        await handleBenefitsUpdate(req.supabase, event);
        break;
      default:
        throw new Error(`Unhandled Sikka event type: ${event.eventType}`);
    }

    res.status(200).send();
  })
);

// OpenAI Webhooks
router.post(
  '/openai',
  validateRequest(ValidationSchemas.openaiWebhook),
  validateWebhookSignature,
  asyncHandler(async (req: Request<{}, {}, OpenAIWebhookEvent>, res: Response) => {
    const event = req.body;

    switch (event.eventType) {
      case 'completion.finished':
        await handleCompletionFinished(req.supabase, event);
        break;
      case 'error':
        await handleOpenAIError(req.supabase, event);
        break;
      case 'moderation.flagged':
        await handleModerationFlagged(req.supabase, event);
        break;
      default:
        throw new Error(`Unhandled OpenAI event type: ${event.eventType}`);
    }

    res.status(200).send();
  })
);

// Retell Event Handlers
async function handleCallStarted(supabase: SupabaseClient<Database>, event: RetellCallStartedEvent) {
  await supabase
    .from('call_logs')
    .insert({
      call_id: event.callId,
      status: 'started',
      start_time: new Date().toISOString(),
      metadata: event.data
    });
}

async function handleCallEnded(supabase: SupabaseClient<Database>, event: RetellCallEndedEvent) {
  await supabase
    .from('call_logs')
    .update({
      status: 'ended',
      end_time: new Date().toISOString(),
      duration: event.data.duration,
      metadata: event.data
    })
    .eq('call_id', event.callId);
}

async function handleTranscription(supabase: SupabaseClient<Database>, event: RetellTranscriptionEvent) {
  await supabase
    .from('call_transcripts')
    .insert({
      call_id: event.callId,
      speaker_id: event.data.speakerId,
      speaker_type: event.data.speakerType,
      text: event.data.text,
      start_time: event.data.startTime,
      end_time: event.data.endTime,
      metadata: event.data.metadata
    });
}

async function handleRecording(supabase: SupabaseClient<Database>, event: RetellRecordingEvent) {
  await supabase
    .from('call_recordings')
    .insert({
      call_id: event.callId,
      url: event.data.url,
      duration: event.data.duration,
      format: event.data.format,
      metadata: event.data.metadata
    });
}

// Sikka Event Handlers
async function handleEligibilityVerified(supabase: SupabaseClient<Database>, event: SikkaEligibilityVerifiedEvent) {
  await supabase
    .from('insurance_eligibility')
    .insert({
      patient_id: event.data.patientId,
      insurance_id: event.data.insuranceId,
      status: event.data.status,
      verification_date: event.data.verificationDate,
      coverage: event.data.coverage,
      metadata: event.data
    });
}

async function handleClaimStatusUpdate(supabase: SupabaseClient<Database>, event: SikkaClaimStatusEvent) {
  await supabase
    .from('insurance_claims')
    .update({
      status: event.data.status,
      update_date: event.data.updateDate,
      payment_amount: event.data.paymentAmount,
      denial_reason: event.data.denialReason,
      eob: event.data.eob,
      metadata: event.data
    })
    .eq('claim_id', event.data.claimId);
}

async function handlePreAuthStatusUpdate(supabase: SupabaseClient<Database>, event: SikkaPreAuthStatusEvent) {
  await supabase
    .from('pre_authorizations')
    .update({
      status: event.data.status,
      update_date: event.data.updateDate,
      approved_procedures: event.data.approvedProcedures,
      denial_reason: event.data.denialReason,
      additional_info_required: event.data.additionalInfoRequired,
      metadata: event.data
    })
    .eq('preauth_id', event.data.preAuthId);
}

async function handleBenefitsUpdate(supabase: SupabaseClient<Database>, event: SikkaBenefitsUpdateEvent) {
  await supabase
    .from('insurance_benefits')
    .insert({
      patient_id: event.data.patientId,
      insurance_id: event.data.insuranceId,
      update_date: event.data.updateDate,
      changes: event.data.changes,
      metadata: event.data
    });
}

// OpenAI Event Handlers
async function handleCompletionFinished(supabase: SupabaseClient<Database>, event: OpenAICompletionEvent) {
  await supabase
    .from('ai_completions')
    .insert({
      completion_id: event.data.completionId,
      request_id: event.data.requestId,
      model: event.data.model,
      choices: event.data.choices,
      usage: event.data.usage,
      metadata: {
        organizationId: event.organizationId,
        modelId: event.modelId,
        timestamp: event.timestamp
      }
    });
}

async function handleOpenAIError(supabase: SupabaseClient<Database>, event: OpenAIErrorEvent) {
  await supabase
    .from('ai_errors')
    .insert({
      request_id: event.data.requestId,
      error: event.data.error,
      metadata: {
        organizationId: event.organizationId,
        modelId: event.modelId,
        timestamp: event.timestamp
      }
    });
}

async function handleModerationFlagged(supabase: SupabaseClient<Database>, event: OpenAIModeratedEvent) {
  await supabase
    .from('ai_moderation_flags')
    .insert({
      request_id: event.data.requestId,
      results: event.data.results,
      metadata: {
        organizationId: event.organizationId,
        modelId: event.modelId,
        timestamp: event.timestamp
      }
    });
}

export const webhookRoutes: Router = router;