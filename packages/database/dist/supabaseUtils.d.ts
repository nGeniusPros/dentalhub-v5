import { PostgrestFilterBuilder } from "@supabase/supabase-js";
import { Database } from "./types";
type TableNames = keyof Database["public"]["Tables"];
/**
 * Safely perform a select query on a table with proper error handling
 * @param table The table name to query
 * @returns A query builder with error handling
 */
export declare const safeSelect: <T extends TableNames>(table: T) => any;
/**
 * Add pagination to a Supabase query
 * @param query The query to paginate
 * @param page The page number (1-based)
 * @param pageSize The number of items per page
 * @returns The paginated query
 */
export declare const withPagination: <T>(query: PostgrestFilterBuilder<T>, page: number, pageSize: number) => any;
/**
 * Type-safe wrapper for count queries
 * @param table The table name to count
 * @returns The count query with error handling
 */
export declare const safeCount: <T extends TableNames>(table: T) => any;
/**
 * Type-safe wrapper for insert operations
 * @param table The table name to insert into
 * @param data The data to insert
 * @returns The insert query with error handling
 */
export declare const safeInsert: <T extends TableNames>(table: T, data: Partial<Database["public"]["Tables"][T]["Insert"]>) => any;
/**
 * Type-safe wrapper for update operations
 * @param table The table name to update
 * @param data The data to update
 * @returns The update query with error handling
 */
export declare const safeUpdate: <T extends TableNames>(table: T, data: Partial<Database["public"]["Tables"][T]["Update"]>) => any;
export {};
//# sourceMappingURL=supabaseUtils.d.ts.map