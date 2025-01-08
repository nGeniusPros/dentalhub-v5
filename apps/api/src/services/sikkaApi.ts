import axios from 'axios';
import { z } from 'zod';
import { handleError } from '../utils/errorHandlers';
import { rateLimiter } from '../utils/rateLimiter';

// Validation schemas
const RequestKeyResponse = z.object({
  request_key: z.string()
});

export interface PaginationParams {
  offset: number;
  limit: number;
}

/**
 * Get request key for Sikka API authentication
 */
export async function getRequestKey(
  appId: string,
  appKey: string,
  masterId: string,
  practiceKey: string
): Promise<string> {
  try {
    const response = await axios.post('https://api.sikkasoft.com/v4/request_key', {
      grant_type: 'request_key',
      office_id: masterId,
      secret_key: practiceKey,
      app_id: appId,
      app_key: appKey
    });

    const parsed = RequestKeyResponse.parse(response.data);
    return parsed.request_key;
  } catch (error) {
    throw handleError(error, 'Failed to get request key');
  }
}

/**
 * Generic function to fetch paginated data from Sikka API
 */
export async function getPaginatedData<T>(
  requestKey: string,
  practiceId: string,
  endpoint: string,
  fields: string,
  limit: number = 500
): Promise<T[]> {
  const allData: T[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      // Rate limiting check
      await rateLimiter.checkLimit();

      const url = `https://api.sikkasoft.com/v4/${endpoint}`;
      const response = await axios.get(url, {
        headers: {
          'request-key': requestKey
        },
        params: {
          practice_id: practiceId,
          fields,
          offset,
          limit
        }
      });

      const responseData = response.data;

      if (responseData && responseData.items && Array.isArray(responseData.items)) {
        allData.push(...responseData.items);
        hasMore = responseData.items.length === limit;
      } else if (responseData && Array.isArray(responseData)) {
        allData.push(...responseData);
        hasMore = responseData.length === limit;
      } else if (responseData) {
        allData.push(responseData);
        hasMore = false;
      } else {
        hasMore = false;
      }

      offset += limit;

    } catch (error) {
      throw handleError(error, `Failed to fetch data from ${endpoint}`);
    }
  }

  return allData;
}

/**
 * Generic function to fetch single record from Sikka API
 */
export async function getSingleRecord<T>(
  requestKey: string,
  practiceId: string,
  endpoint: string,
  fields: string
): Promise<T> {
  try {
    await rateLimiter.checkLimit();

    const url = `https://api.sikkasoft.com/v4/${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'request-key': requestKey
      },
      params: {
        practice_id: practiceId,
        fields
      }
    });

    return response.data;
  } catch (error) {
    throw handleError(error, `Failed to fetch data from ${endpoint}`);
  }
}