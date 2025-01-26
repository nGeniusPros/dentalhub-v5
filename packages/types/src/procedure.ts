import { ISO8601String, UUID, Timestamps } from "./common.js";

export interface ProcedureCode extends Timestamps {
  id: UUID;
  sikka_practice_id: number;
  sikka_cust_id: number;
  procedure_code: string;
  description: string;
  abbreviation: string;
  category_id: UUID | null;
  sikka_category_id: string;
  explosion_code: string;
  submit_to_insurance: boolean;
  allow_discount: boolean;
  effect_on_patient_balance: string;
  effect_on_provider_production: string;
  effect_on_provider_collection: string;
  procedure_type: string;
  is_active: boolean;
  last_sync_date: ISO8601String | null;
  last_modified_date: ISO8601String | null;
  last_modified_by: UUID | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ProcedureCategory extends Timestamps {
  id: UUID;
  sikka_practice_id: number;
  sikka_category_id: string;
  category: string;
}

export interface ProcedureCategoryMapping extends Timestamps {
  id: UUID;
  sikka_practice_id: number;
  procedure_code: string;
  category_id: UUID;
  pms_category: string;
  pms_description: string;
}

export interface ProcedureFeeSchedule extends Timestamps {
  id: UUID;
  procedure_code_id: UUID;
  effective_date: ISO8601String;
  end_date: ISO8601String | null;
  fee_amount: number;
}

export type ChangeType =
  | "created"
  | "updated"
  | "activated"
  | "deactivated"
  | "deleted";

export interface ChangeHistory<T> {
  id: UUID;
  change_type: ChangeType;
  previous_data: Partial<T> | null;
  new_data: Partial<T>;
  changed_by: UUID;
  changed_at: ISO8601String;
}

export interface ProcedureCodeHistory extends ChangeHistory<ProcedureCode> {
  procedure_code_id: UUID;
}

export interface ProcedureCategoryMappingHistory
  extends ChangeHistory<ProcedureCategoryMapping> {
  mapping_id: UUID;
}
