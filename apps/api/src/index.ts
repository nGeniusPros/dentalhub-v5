import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { RetellService, createRetellService } from '@dentalhub/core';
import campaignRoutes from './routes/campaigns';
import { communicationRoutes } from './routes/communication';
import { webhookRoutes } from './routes/webhooks';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Retell service
const retellConfig = {
  baseUrl: process.env.RETELL_BASE_URL!,
  wsUrl: process.env.RETELL_WEBSOCKET_URL!,
  apiKey: process.env.RETELL_API_KEY!,
  agentId: process.env.RETELL_AGENT_1_ID!,
  llmId: process.env.RETELL_AGENT_1_LLM!,
  phoneNumber: process.env.RETELL_AGENT_1_PHONE!
};

const retellService = createRetellService(retellConfig);

// Create Express app
const app = express();

// Configure middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Dependency injection middleware
app.use((req: any, res, next) => {
  req.supabase = supabaseClient;
  req.retell = retellService;
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});