export interface PaginationParams {
    offset: number;
    limit: number;
}
/**
 * Get request key for Sikka API authentication
 */
export declare function getRequestKey(appId: string, appKey: string, masterId: string, practiceKey: string): Promise<string>;
/**
 * Generic function to fetch paginated data from Sikka API
 */
export declare function getPaginatedData<T>(requestKey: string, practiceId: string, endpoint: string, fields: string, limit?: number): Promise<T[]>;
/**
 * Generic function to fetch single record from Sikka API
 */
export declare function getSingleRecord<T>(requestKey: string, practiceId: string, endpoint: string, fields: string): Promise<T>;
