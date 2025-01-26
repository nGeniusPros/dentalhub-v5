import { db } from "@dentalhub/database";
import type { SikkaProcedureCodeData } from "../types/api";

/**
 * Syncs procedure codes from Sikka API to our database
 */
export async function syncProcedureCodes(
  sikkaProcedureCodes: SikkaProcedureCodeData[],
  practiceId: number,
): Promise<void> {
  // Process procedure codes in batches to avoid overwhelming the database
  const batchSize = 100;
  for (let i = 0; i < sikkaProcedureCodes.length; i += batchSize) {
    const batch = sikkaProcedureCodes.slice(i, i + batchSize);
    await Promise.all(batch.map((code) => syncProcedureCode(code, practiceId)));
  }
}

/**
 * Syncs a single procedure code from Sikka API
 */
async function syncProcedureCode(
  sikkaProcedureCode: SikkaProcedureCodeData,
  practiceId: number,
): Promise<void> {
  try {
    // Find or create the procedure category
    const category = await db.procedure_categories.upsert({
      where: {
        sikka_practice_id_category_id: {
          sikka_practice_id: practiceId,
          sikka_category_id: sikkaProcedureCode.procedure_code_category_id,
        },
      },
      update: {},
      create: {
        sikka_practice_id: practiceId,
        sikka_category_id: sikkaProcedureCode.procedure_code_category_id,
        category: sikkaProcedureCode.procedure_code_category,
      },
    });

    // Upsert the procedure code
    await db.procedure_codes.upsert({
      where: {
        sikka_practice_id_procedure_code: {
          sikka_practice_id: practiceId,
          procedure_code: sikkaProcedureCode.procedure_code,
        },
      },
      update: {
        description: sikkaProcedureCode.procedure_code_description,
        abbreviation: sikkaProcedureCode.abbreaviation,
        category_id: category.id,
        sikka_category_id: sikkaProcedureCode.procedure_code_category_id,
        explosion_code: sikkaProcedureCode.explosion_code,
        submit_to_insurance: sikkaProcedureCode.submit_to_insurance === "true",
        allow_discount: sikkaProcedureCode.allow_discount === "true",
        effect_on_patient_balance:
          sikkaProcedureCode.procedure_code_effect_on_patient_balance,
        effect_on_provider_production:
          sikkaProcedureCode.procedure_code_effect_on_provider_production,
        effect_on_provider_collection:
          sikkaProcedureCode.procedure_code_effect_on_provider_collection,
        procedure_type: sikkaProcedureCode.procedure_code_type,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        sikka_practice_id: practiceId,
        sikka_cust_id: sikkaProcedureCode.cust_id,
        procedure_code: sikkaProcedureCode.procedure_code,
        description: sikkaProcedureCode.procedure_code_description,
        abbreviation: sikkaProcedureCode.abbreaviation,
        category_id: category.id,
        sikka_category_id: sikkaProcedureCode.procedure_code_category_id,
        explosion_code: sikkaProcedureCode.explosion_code,
        submit_to_insurance: sikkaProcedureCode.submit_to_insurance === "true",
        allow_discount: sikkaProcedureCode.allow_discount === "true",
        effect_on_patient_balance:
          sikkaProcedureCode.procedure_code_effect_on_patient_balance,
        effect_on_provider_production:
          sikkaProcedureCode.procedure_code_effect_on_provider_production,
        effect_on_provider_collection:
          sikkaProcedureCode.procedure_code_effect_on_provider_collection,
        procedure_type: sikkaProcedureCode.procedure_code_type,
        is_active: true,
      },
    });
  } catch (error) {
    console.error(
      `Error syncing procedure code ${sikkaProcedureCode.procedure_code}:`,
      error,
    );
    throw error;
  }
}

/**
 * Updates fee schedule for a procedure code
 */
export async function updateProcedureCodeFee(
  practiceId: number,
  procedureCode: string,
  feeAmount: number,
  effectiveDate: Date,
): Promise<void> {
  const procedure = await db.procedure_codes.findUnique({
    where: {
      sikka_practice_id_procedure_code: {
        sikka_practice_id: practiceId,
        procedure_code: procedureCode,
      },
    },
  });

  if (!procedure) {
    throw new Error(
      `Procedure code ${procedureCode} not found for practice ${practiceId}`,
    );
  }

  // End any current fee schedules
  await db.procedure_fee_schedule.updateMany({
    where: {
      procedure_code_id: procedure.id,
      end_date: null,
    },
    data: {
      end_date: new Date(),
    },
  });

  // Create new fee schedule
  await db.procedure_fee_schedule.create({
    data: {
      procedure_code_id: procedure.id,
      fee_amount: feeAmount,
      effective_date: effectiveDate,
      end_date: null,
    },
  });
}

/**
 * Gets all active procedure codes for a practice with their current fees
 */
export async function getPracticeProcedureCodes(practiceId: number) {
  return db.procedure_codes.findMany({
    where: {
      sikka_practice_id: practiceId,
      is_active: true,
    },
    include: {
      category: true,
      fee_schedules: {
        where: {
          OR: [{ end_date: null }, { end_date: { gt: new Date() } }],
        },
        orderBy: { effective_date: "desc" },
        take: 1,
      },
    },
  });
}
