import { MonitoringService } from '../services/monitoring';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        MonitoringService.logRequest(req.method, req.originalUrl, res.statusCode, duration);
    });
    next();
};
