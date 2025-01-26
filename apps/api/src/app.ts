import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import assistantRoutes from "./routes/ai/assistant-routes";
import { createClient } from "@supabase/supabase-js";
import { AuthenticatedRequest } from "./middleware/auth";
import { openapiValidator, handleValidationError } from "./middleware/openapi-validator";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { dashboardRoutes } from "./routes/dashboard";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key missing from environment variables.");
  process.exit(1); // Exit if env variables are not set
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Basic middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(requestLogger);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// Attach Supabase client to request
app.use(
  (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    req.supabase = supabase;
    next();
  },
);

// Serve OpenAPI documentation
app.use('/api-docs', express.static(path.join(__dirname, 'openapi')));

// OpenAPI validation
app.use(openapiValidator);

// Routes
app.use("/api/ai", assistantRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling
app.use(handleValidationError);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
    });
  },
);
app.use(errorHandler);

export default app;
