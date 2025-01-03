import { Router, Request, Response } from 'express';
import { validateWebhookSignature } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/retell', validateWebhookSignature, asyncHandler(async (req: any, res: Response) => {
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
  }

  res.status(200).send();
}));

async function handleCallStarted(supabase: any, event: any) {
  await supabase
    .from('call_logs')
    .insert({
      call_id: event.callId,
      status: 'started',
      start_time: new Date().toISOString(),
      metadata: event.data
    });
}

async function handleCallEnded(supabase: any, event: any) {
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

async function handleTranscription(supabase: any, event: any) {
  await supabase
    .from('call_transcripts')
    .insert({
      call_id: event.callId,
      timestamp: event.timestamp,
      text: event.data.text,
      speaker: event.data.speaker
    });
}

async function handleRecording(supabase: any, event: any) {
  await supabase
    .from('call_recordings')
    .insert({
      call_id: event.callId,
      url: event.data.url,
      duration: event.data.duration
    });
}

export const webhookRoutes: Router = router;