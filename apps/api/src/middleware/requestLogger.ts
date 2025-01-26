import { Request, Response, NextFunction } from "express";
import { MonitoringService } from "../services/monitoring";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    MonitoringService.logRequest(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
    );
  });
  next();
};
