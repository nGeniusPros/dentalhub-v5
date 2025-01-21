import { createLogger, format, transports } from 'winston';
import { Gauge, Counter, Registry } from 'prom-client';
import { ErrorCode } from '../types/errors';

// Create a Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Create a Prometheus registry
const registry = new Registry();

// Define metrics
const httpRequestDurationMicroseconds = new Gauge({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  registers: [registry]
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
  registers: [registry]
});

const edgeFunctionDurationMicroseconds = new Gauge({
  name: 'edge_function_duration_ms',
  help: 'Duration of edge function execution in ms',
  labelNames: ['function', 'status'],
  registers: [registry]
});

const edgeFunctionCallsTotal = new Counter({
  name: 'edge_function_calls_total',
  help: 'Total number of edge function calls',
  labelNames: ['function', 'status'],
  registers: [registry]
});

const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache'],
  registers: [registry]
});

const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache'],
  registers: [registry]
});

export class MonitoringService {
  // Log HTTP request
  static logRequest(method: string, route: string, statusCode: number, duration: number) {
    httpRequestDurationMicroseconds
      .labels(method, route, statusCode.toString())
      .set(duration);
    
    httpRequestsTotal
      .labels(method, route, statusCode.toString())
      .inc();

    logger.info('HTTP Request', {
      method,
      route,
      statusCode,
      duration
    });
  }

  // Log edge function execution
  static logEdgeFunction(functionName: string, status: string, duration: number) {
    edgeFunctionDurationMicroseconds
      .labels(functionName, status)
      .set(duration);
    
    edgeFunctionCallsTotal
      .labels(functionName, status)
      .inc();

    logger.info('Edge Function Execution', {
      functionName,
      status,
      duration
    });
  }

  // Log cache operation
  static logCache(cacheName: string, hit: boolean) {
    if (hit) {
      cacheHitsTotal.labels(cacheName).inc();
    } else {
      cacheMissesTotal.labels(cacheName).inc();
    }

    logger.debug('Cache Operation', {
      cacheName,
      hit
    });
  }

  // Log error
  static logError(error: Error, code: ErrorCode, context?: any) {
    logger.error('Error', {
      message: error.message,
      code,
      stack: error.stack,
      context
    });
  }

  // Get metrics
  static async getMetrics() {
    return registry.metrics();
  }

  // Reset metrics (useful for testing)
  static resetMetrics() {
    registry.resetMetrics();
  }
}

// Export the logger for direct use
export { logger };