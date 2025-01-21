import { getCallStatus, getTranscription, getAnalysis } from '../integrations/retell/service';

describe('Retell Integration', () => {
  it('should get call status successfully', async () => {
    const callId = 'call-id-1';
    const result = await getCallStatus(callId);
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
  });

  it('should get transcription successfully', async () => {
    const callId = 'call-id-1';
    const result = await getTranscription(callId);
    expect(result).toBeDefined();
    expect(result.transcript).toBeDefined();
  });

  it('should get AI analysis successfully', async () => {
    const callId = 'call-id-1';
    const result = await getAnalysis(callId);
    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
  });
});