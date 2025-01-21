import type { SikkaProcedureCategoryMappingData, ProcedureCategory, ProcedureCategoryMapping } from '../types/api';
/**
 * Syncs procedure category mappings from Sikka API to our database
 */
export declare function syncProcedureCategoryMappings(sikkaMappings: SikkaProcedureCategoryMappingData[], practiceId: number): Promise<void>;
/**
 * Gets all procedure mappings for a specific category
 */
export declare function getProceduresInCategory(practiceId: number, categoryId: string): Promise<ProcedureCategoryMapping[]>;
/**
 * Gets the category mapping for a specific procedure
 */
export declare function getCategoryForProcedure(practiceId: number, procedureCode: string): Promise<ProcedureCategoryMapping | null>;
/**
 * Gets all categories for a practice
 */
export declare function getPracticeCategories(practiceId: number): Promise<ProcedureCategory[]>;
/**
 * Gets all procedure mappings for a practice
 */
export declare function getPracticeMappings(practiceId: number): Promise<ProcedureCategoryMapping[]>;
/**
 * Gets mapping history for a specific mapping
 */
export declare function getMappingHistory(mappingId: string): Promise<ProcedureCategoryMapping[]>;
/**
 * Deletes a procedure category mapping
 */
export declare function deleteProcedureCategoryMapping(practiceId: number, procedureCode: string): Promise<void>;
