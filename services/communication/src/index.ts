import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import campaignRoutes from './routes/campaigns';
import { createRetellService } from './services/retell/RetellService';
import type { RetellConfig } from './services/retell/types';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Retell service
const retellConfig: RetellConfig = {
  baseUrl: process.env.RETELL_BASE_URL || '',
  wsUrl: process.env.RETELL_WEBSOCKET_URL || '',
  apiKey: process.env.RETELL_API_KEY || '',
  agentId: process.env.RETELL_AGENT_1_ID || '',
  llmId: process.env.RETELL_AGENT_1_LLM || '',
  phoneNumber: process.env.RETELL_AGENT_1_PHONE || ''
};

const retellService = createRetellService(retellConfig);

// Campaign routes
app.use('/api/campaigns', campaignRoutes);

// Voice call routes
app.post('/api/calls', async (req, res) => {
  try {
    const { phoneNumber, config } = req.body;
    const call = await retellService.initiateCall(phoneNumber, config);
    res.json(call);
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

app.get('/api/calls/:callId/recording', async (req, res) => {
  try {
    const { callId } = req.params;
    const recording = await retellService.getCallRecording(callId);
    res.type('audio/mpeg').send(recording);
  } catch (error) {
    console.error('Error getting call recording:', error);
    res.status(500).json({ error: 'Failed to get call recording' });
  }
});

app.put('/api/calls/:callId/config', async (req, res) => {
  try {
    const { callId } = req.params;
    const config = req.body;
    await retellService.updateCallConfig(callId, config);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating call config:', error);
    res.status(500).json({ error: 'Failed to update call config' });
  }
});

// Webhook endpoints
app.post('/webhooks/retell', (req, res) => {
  try {
    const event = req.body;
    console.log('Received Retell webhook event:', event);
    
    // Handle different event types
    switch (event.type) {
      case 'call.started':
        // Update campaign metrics
        break;
      case 'call.ended':
        // Update campaign metrics and status
        break;
      case 'call.transcription':
        // Store transcription data
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.COMMUNICATION_SERVICE_PORT || 3002;

app.listen(PORT, () => {
  console.log(`Communication service running on port ${PORT}`);
});