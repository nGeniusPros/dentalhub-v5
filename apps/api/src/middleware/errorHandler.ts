import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { logger } from "../lib/logger";
import { ErrorCode, ErrorResponse } from "../errors";
import { AxiosError } from "axios";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle structured ErrorResponse
  if (err instanceof ErrorResponse) {
    logger.error("Business logic error:", err.serializeErrorResponse());
    return res.status(err.statusCode).json(err.serializeErrorResponse());
  }

  // Handle Axios errors from external services
  if (err instanceof AxiosError) {
    logger.error("External API error:", {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
    });
    return res.status(502).json({
      type: "https://tools.ietf.org/html/rfc9457#section-5.2",
      title: "Bad Gateway",
      status: 502,
      detail: "Error communicating with external service",
    });
  }

  // Generic error fallback
  logger.error("Unhandled error:", err);
  logger.error("Error Context:", {
    path: req.path,
    method: req.method,
    userId: (req as AuthenticatedRequest).user?.id,
    params: req.params,
    query: req.query,
    // Ensure err is Error to access stack, otherwise default to undefined
    errorStack: err instanceof Error ? err.stack : undefined,
  });
  res.status(500).json({
    type: "https://tools.ietf.org/html/rfc9457#section-5.1",
    title: "Internal Server Error",
    status: 500,
  });
};
