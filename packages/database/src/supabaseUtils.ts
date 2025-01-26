import { PostgrestFilterBuilder } from '@supabase/supabase-js';
import { supabase } from './client.js';

/**
 * Safely perform a select query on a table with proper error handling
 * @param table The table name to query
 * @returns A query builder with error handling
 */
export const safeSelect = <T>(table: string) => 
  supabase.from<T>(table).select().throwOnError();

/**
 * Add pagination to a Supabase query
 * @param query The query to paginate
 * @param page The page number (1-based)
 * @param pageSize The number of items per page
 * @returns The paginated query
 */
export const withPagination = (
  query: PostgrestFilterBuilder<any>, 
  page: number, 
  pageSize: number
) => {
  if (page < 1) throw new Error('Page must be greater than 0');
  if (pageSize < 1) throw new Error('Page size must be greater than 0');
  
  return query.range(
    (page - 1) * pageSize, 
    page * pageSize - 1
  );
};

/**
 * Type-safe wrapper for count queries
 * @param table The table name to count
 * @returns The count query with error handling
 */
export const safeCount = <T>(table: string) =>
  supabase.from<T>(table).count().throwOnError();

/**
 * Type-safe wrapper for insert operations
 * @param table The table name to insert into
 * @param data The data to insert
 * @returns The insert query with error handling
 */
export const safeInsert = <T>(table: string, data: Partial<T>) =>
  supabase.from<T>(table).insert(data).throwOnError();

/**
 * Type-safe wrapper for update operations
 * @param table The table name to update
 * @param data The data to update
 * @returns The update query with error handling
 */
export const safeUpdate = <T>(table: string, data: Partial<T>) =>
  supabase.from<T>(table).update(data).throwOnError();
