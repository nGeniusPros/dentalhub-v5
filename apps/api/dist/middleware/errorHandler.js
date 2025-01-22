import { MonitoringService } from '../services/monitoring';
import { ErrorCode } from '../types/errors';
export const errorHandler = (err, req, res, next) => {
    // Log the error
    MonitoringService.logError(err, err.code || ErrorCode.INTERNAL_ERROR, {
        method: req.method,
        route: req.originalUrl,
        body: req.body,
        error: err.message
    });
    // Handle authentication errors
    if (err.code === ErrorCode.UNAUTHORIZED || err.statusCode === 401) {
        return res.status(401).json({
            error: 'Unauthorized: Please log in to access this resource'
        });
    }
    if (err.code === ErrorCode.FORBIDDEN || err.statusCode === 403) {
        return res.status(403).json({
            error: 'Forbidden: You do not have permission to access this resource'
        });
    }
    // Handle rate limiting errors
    if (err.code === ErrorCode.RATE_LIMIT_EXCEEDED || err.statusCode === 429) {
        return res.status(429).json({
            error: 'Too many requests, please try again later'
        });
    }
    // Handle validation errors
    if (err.code === ErrorCode.VALIDATION_ERROR || err.statusCode === 400) {
        return res.status(400).json({
            error: err.message || 'Invalid request parameters'
        });
    }
    // Default error response
    res.status(err.statusCode || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    });
};
