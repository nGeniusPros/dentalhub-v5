import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import assistantRoutes from "./routes/ai/assistant-routes";
import { createClient } from "@supabase/supabase-js";
import { AuthenticatedRequest } from "./middleware/auth";
import { dashboardRoutes } from "./routes/dashboard"; // Import dashboard routes

const app = express();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key missing from environment variables.");
  process.exit(1); // Exit if env variables are not set
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());

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

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// Routes
app.use("/api/ai", assistantRoutes);
app.use("/api/dashboard", dashboardRoutes); // Use dashboard routes

// Error handling
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

export default app;
