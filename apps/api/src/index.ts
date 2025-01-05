// ============================================================================
// API Gateway Server Setup
// ============================================================================

// ---------------------------- External Dependencies ----------------------------
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// ---------------------------- Route Imports ----------------------------------
import campaignRoutes from './routes/campaigns';
import { webhookRoutes } from './routes/webhooks';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import paymentsRouter from './routes/payments';
import insuranceRouter from './routes/insurance';
import revenueRouter from './routes/revenue';
import analyticsRouter from './routes/analytics';
import learningRouter from './routes/learning';
import settingsRouter from './routes/settings';
import sikkaRouter from './integrations/sikka';
import retellRouter from './integrations/retell';
import documentsRouter from './edge-functions/documents';
import notificationsRouter from './edge-functions/notifications';
import mediaRouter from './edge-functions/media';
import syncRouter from './edge-functions/sync';

// ---------------------------- Middleware Imports -----------------------------
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { config } from 'dotenv';
import { MonitoringService } from './services/monitoring';
import { PatientService } from './services/patientService';

// ---------------------------- Environment Setup -----------------------------
// Load environment variables
config();

// ---------------------------- Service Initialization ------------------------
// Initialize Supabase client
const supabaseClient = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ---------------------------- Express App Setup ----------------------------
// Create Express app
const app = express();

// ---------------------------- Middleware Configuration ---------------------
// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		credentials: true
}));

// Body parsing
app.use(express.json());

// Request logging
app.use(requestLogger);

// Rate limiting configuration
const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ---------------------------- Service Injection ---------------------------
// Dependency injection middleware
app.use((req: any, res, next) => {
		req.supabase = supabaseClient;
		next();
});

// ---------------------------- Routes Configuration -----------------------
// Health check endpoint
app.get('/health', (req, res) => {
		res.json({ status: 'ok' });
});

// API routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api/insurance', insuranceRouter);
app.use('/api/revenue', revenueRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/learning', learningRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/sikka', sikkaRouter);
app.use('/api/retell', retellRouter);
app.use('/api/edge-functions/documents', documentsRouter);
app.use('/api/edge-functions/notifications', notificationsRouter);
app.use('/api/edge-functions/media', mediaRouter);
app.use('/api/edge-functions/sync', syncRouter);

// ---------------------------- Error Handling ----------------------------
app.use(errorHandler);

// ---------------------------- Server Startup ---------------------------
const PORT = process.env.PORT || 3000;
const instances = process.env.API_INSTANCES ? parseInt(process.env.API_INSTANCES) : 1;
let currentInstance = 0;

app.listen(PORT, async () => {
  currentInstance++;
  if (currentInstance > instances) {
    currentInstance = 1;
  }
  MonitoringService.logServerStart(PORT, currentInstance);
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

  // Sync patients from Sikka on server start
  const patientService = new PatientService(supabaseClient);
  await patientService.syncPatientsFromSikka();
});

// Load balancing middleware
app.use((req, res, next) => {
  if (instances > 1) {
    currentInstance = (currentInstance + 1) % instances;
    res.setHeader('X-Instance-ID', currentInstance);
  }
  next();
});