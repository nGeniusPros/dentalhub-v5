// ============================================================================
// API Gateway Server Setup
// ============================================================================

// ---------------------------- External Dependencies ----------------------------
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
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
import { authenticationMiddleware } from './middleware/authenticationMiddleware';
import { config } from 'dotenv';
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
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

// Apply rate limiting to all routes under /api
const apiRouter = express.Router();
apiRouter.use(apiLimiter);

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

// Mount API routes under rate-limited router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/webhooks', webhookRoutes);

// Protected routes - use authenticationMiddleware here
apiRouter.use('/campaigns', authenticationMiddleware, campaignRoutes);
apiRouter.use('/dashboard', authenticationMiddleware, dashboardRoutes);
apiRouter.use('/payments', authenticationMiddleware, paymentsRouter);
apiRouter.use('/insurance', authenticationMiddleware, insuranceRouter);
apiRouter.use('/revenue', authenticationMiddleware, revenueRouter);
apiRouter.use('/analytics', authenticationMiddleware, analyticsRouter);
apiRouter.use('/learning', authenticationMiddleware, learningRouter);
apiRouter.use('/settings', authenticationMiddleware, settingsRouter);
apiRouter.use('/sikka', authenticationMiddleware, sikkaRouter);
apiRouter.use('/retell', authenticationMiddleware, retellRouter);
apiRouter.use('/edge-functions/documents', authenticationMiddleware, documentsRouter);
apiRouter.use('/edge-functions/notifications', authenticationMiddleware, notificationsRouter);
apiRouter.use('/edge-functions/media', authenticationMiddleware, mediaRouter);
apiRouter.use('/edge-functions/sync', authenticationMiddleware, syncRouter);

// Mount the API router
app.use('/api', apiRouter);

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