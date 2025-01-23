import { db } from '@dentalhub/database';
/**
 * Syncs procedure category mappings from Sikka API to our database
 */
export async function syncProcedureCategoryMappings(sikkaMappings, practiceId) {
    // Process mappings in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < sikkaMappings.length; i += batchSize) {
        const batch = sikkaMappings.slice(i, i + batchSize);
        await Promise.all(batch.map(mapping => syncProcedureCategoryMapping(mapping, practiceId)));
    }
}
/**
 * Syncs a single procedure category mapping from Sikka API
 */
async function syncProcedureCategoryMapping(sikkaMapping, practiceId) {
    try {
        // First ensure the category exists
        const category = await db.procedureCategory.upsert({
            where: {
                sikka_practice_id_category: {
                    sikka_practice_id: practiceId,
                    category: sikkaMapping.category
                }
            },
            update: {},
            create: {
                sikka_practice_id: practiceId,
                category: sikkaMapping.category,
                sikka_category_id: sikkaMapping.category // Using category as ID if not provided separately
            }
        });
        // Then upsert the mapping
        await db.procedureCategoryMapping.upsert({
            where: {
                unique_practice_procedure_mapping: {
                    sikka_practice_id: practiceId,
                    procedure_code: sikkaMapping.procedure_code
                }
            },
            update: {
                category_id: category.id,
                pms_category: sikkaMapping.pms_procedure_category,
                pms_description: sikkaMapping.pms_procedure_description,
                updated_at: new Date()
            },
            create: {
                sikka_practice_id: practiceId,
                procedure_code: sikkaMapping.procedure_code,
                category_id: category.id,
                pms_category: sikkaMapping.pms_procedure_category,
                pms_description: sikkaMapping.pms_procedure_description ?? null
            }
        });
    }
    catch (error) {
        console.error(`Error syncing procedure category mapping for ${sikkaMapping.procedure_code}:`, error);
        throw error;
    }
}
/**
 * Gets all procedure mappings for a specific category
 */
export async function getProceduresInCategory(practiceId, categoryId) {
    return db.procedureCategoryMapping.findMany({
        where: {
            sikka_practice_id: practiceId,
            category_id: categoryId
        },
        include: {
            category: true
        }
    });
}
/**
 * Gets the category mapping for a specific procedure
 */
export async function getCategoryForProcedure(practiceId, procedureCode) {
    return db.procedure_category_mappings.findUnique({
        where: {
            sikka_practice_id_procedure_code: {
                sikka_practice_id: practiceId,
                procedure_code: procedureCode
            }
        },
        include: {
            category: true
        }
    });
}
/**
 * Gets all categories for a practice
 */
export async function getPracticeCategories(practiceId) {
    return db.procedure_categories.findMany({
        where: {
            sikka_practice_id: practiceId
        },
        include: {
            mappings: true
        }
    });
}
/**
 * Gets all procedure mappings for a practice
 */
export async function getPracticeMappings(practiceId) {
    return db.procedure_category_mappings.findMany({
        where: {
            sikka_practice_id: practiceId
        },
        include: {
            category: true
        },
        orderBy: {
            procedure_code: 'asc'
        }
    });
}
/**
 * Gets mapping history for a specific mapping
 */
export async function getMappingHistory(mappingId) {
    return db.procedure_category_mapping_history.findMany({
        where: {
            mapping_id: mappingId
        },
        orderBy: {
            changed_at: 'desc'
        }
    });
}
/**
 * Deletes a procedure category mapping
 */
export async function deleteProcedureCategoryMapping(practiceId, procedureCode) {
    await db.procedure_category_mappings.delete({
        where: {
            sikka_practice_id_procedure_code: {
                sikka_practice_id: practiceId,
                procedure_code: procedureCode
            }
        }
    });
}
