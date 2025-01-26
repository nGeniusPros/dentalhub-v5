import { supabase } from "./client.js";
/**
 * Safely perform a select query on a table with proper error handling
 * @param table The table name to query
 * @returns A query builder with error handling
 */
export const safeSelect = (table) => supabase.from(table).select().throwOnError();
/**
 * Add pagination to a Supabase query
 * @param query The query to paginate
 * @param page The page number (1-based)
 * @param pageSize The number of items per page
 * @returns The paginated query
 */
export const withPagination = (query, page, pageSize) => {
    if (page < 1)
        throw new Error("Page must be greater than 0");
    if (pageSize < 1)
        throw new Error("Page size must be greater than 0");
    return query.range((page - 1) * pageSize, page * pageSize - 1);
};
/**
 * Type-safe wrapper for count queries
 * @param table The table name to count
 * @returns The count query with error handling
 */
export const safeCount = (table) => supabase.from(table).count().throwOnError();
/**
 * Type-safe wrapper for insert operations
 * @param table The table name to insert into
 * @param data The data to insert
 * @returns The insert query with error handling
 */
export const safeInsert = (table, data) => supabase.from(table).insert(data).throwOnError();
/**
 * Type-safe wrapper for update operations
 * @param table The table name to update
 * @param data The data to update
 * @returns The update query with error handling
 */
export const safeUpdate = (table, data) => supabase.from(table).update(data).throwOnError();
//# sourceMappingURL=supabaseUtils.js.map