import { ErrorCode } from '../types/errors';
declare const logger: import("winston").Logger;
export declare class MonitoringService {
    static logRequest(method: string, route: string, statusCode: number, duration: number): void;
    static logEdgeFunction(functionName: string, status: string, duration: number): void;
    static logCache(cacheName: string, hit: boolean): void;
    static logError(error: Error, code: ErrorCode, context?: any): void;
    static getMetrics(): Promise<string>;
    static resetMetrics(): void;
}
export { logger };
