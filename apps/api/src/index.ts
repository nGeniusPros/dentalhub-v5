import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import patientsRouter from "./routes/patients";
import providersRouter from "./routes/providers";
import { dashboardRoutes as dashboardRouter } from "./routes/dashboard";
import sikkaRouter from "./routes/sikka";
import { authRoutes } from "./routes/auth";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { createClient } from "@supabase/supabase-js";
import logger from "./lib/logger";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from API's .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Verify required environment variables
const requiredEnvVars = [
  "PORT",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SIKKA_APP_ID",
  "SIKKA_APP_KEY",
  "SIKKA_PRACTICE_ID",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const port = parseInt(process.env.PORT!);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(requestLogger);

// Supabase client initialization
app.use((req: any, res, next) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    },
  );
  req.supabase = supabase;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientsRouter);
app.use("/api/providers", providersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/sikka", sikkaRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Error handling (must be last middleware)
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

app.listen(port, () => {
  logger.info(`API server running on port ${port}`);
  logger.info("Environment variables:", {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "set"
      : "missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "set"
      : "missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "set"
      : "missing",
    SIKKA_APP_ID: process.env.SIKKA_APP_ID ? "set" : "missing",
    SIKKA_APP_KEY: process.env.SIKKA_APP_KEY ? "set" : "missing",
    SIKKA_PRACTICE_ID: process.env.SIKKA_PRACTICE_ID ? "set" : "missing",
  });
});
