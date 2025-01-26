import { Request, Response, NextFunction } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { ErrorCode } from "../types/errors";
import logger from "../lib/logger";

interface AuthenticatedUser {
  id: string;
  email?: string;
  role: string;
  practice_id?: string;
}

export interface AuthenticatedRequest<T = unknown> extends Request {
  supabase: SupabaseClient<Database>;
  user?: AuthenticatedUser;
  validated?: T;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies["sb-access-token"];

    // Validate authentication token exists
    if (!token) {
      logger.warn("Authentication attempt without token", { path: req.path });
      return res.status(401).json({
        code: ErrorCode.AUTH_REQUIRED,
        message: "Authentication required",
        docs: "https://docs.dentalhub.com/errors/AUTH_REQUIRED",
      });
    }

    // Get user from Supabase
    const {
      data: { user },
      error,
    } = await req.supabase.auth.getUser(token);

    // Handle Supabase errors
    if (error) {
      logger.error("Supabase authentication error", { error, path: req.path });
      return res.status(401).json({
        code: ErrorCode.INVALID_CREDENTIALS,
        message: "Invalid authentication token",
        resolution: "Refresh your token or reauthenticate",
        docs: "https://docs.dentalhub.com/errors/INVALID_CREDENTIALS",
      });
    }

    // Validate user exists
    if (!user) {
      logger.warn("User not found for valid token", {
        token: token.slice(0, 6),
      });
      return res.status(404).json({
        code: ErrorCode.USER_NOT_FOUND,
        message: "User not found for provided token",
        docs: "https://docs.dentalhub.com/errors/USER_NOT_FOUND",
      });
    }

    // Add standardized user context
    req.user = {
      id: user.id,
      email: user.email ?? "unknown@dentalhub.com",
      role: (user.user_metadata?.role || "staff") as string,
      practice_id: user.user_metadata?.practice_id || "unknown",
    };

    req.user = user; // Assuming you want to attach the user to the request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Authentication system error" });
  }
};
