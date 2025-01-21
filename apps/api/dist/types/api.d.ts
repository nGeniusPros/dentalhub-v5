export interface SikkaProcedureCodeData {
    practice_id: number;
    cust_id: number;
    procedure_code: string;
    procedure_code_description: string;
    abbreaviation: string;
    procedure_code_category: string;
    procedure_code_category_id: string;
    explosion_code: string;
    submit_to_insurance: string;
    allow_discount: string;
    procedure_code_effect_on_patient_balance: string;
    procedure_code_effect_on_provider_production: string;
    procedure_code_effect_on_provider_collection: string;
    procedure_code_type: string;
}
export interface SikkaProcedureCategoryMappingData {
    practice_id: number;
    procedure_code: string;
    category: string;
    pms_procedure_category: string;
    pms_procedure_description: string;
}
export interface ProcedureCategory {
    id: string;
    sikka_practice_id: number;
    sikka_category_id: string;
    category: string;
    created_at: Date;
    updated_at: Date;
}
export interface ProcedureCategoryMapping {
    id: string;
    sikka_practice_id: number;
    procedure_code: string;
    category_id: string;
    pms_category: string;
    pms_description: string;
    created_at: Date;
    updated_at: Date;
}
export interface ProcedureCategoryMappingHistory {
    id: string;
    mapping_id: string;
    change_type: 'created' | 'updated' | 'deleted';
    previous_data: Partial<ProcedureCategoryMapping> | null;
    new_data: Partial<ProcedureCategoryMapping>;
    changed_by: string;
    changed_at: Date;
}
export interface ProcedureCode {
    id: string;
    sikka_practice_id: number;
    sikka_cust_id: number;
    procedure_code: string;
    description: string;
    abbreviation: string;
    category_id: string | null;
    sikka_category_id: string;
    explosion_code: string;
    submit_to_insurance: boolean;
    allow_discount: boolean;
    effect_on_patient_balance: string;
    effect_on_provider_production: string;
    effect_on_provider_collection: string;
    procedure_type: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface ProcedureCodeHistory {
    id: string;
    procedure_code_id: string;
    change_type: 'created' | 'updated' | 'activated' | 'deactivated';
    previous_data: Partial<ProcedureCode> | null;
    new_data: Partial<ProcedureCode>;
    changed_by: string;
    changed_at: Date;
}
export interface ProcedureFeeSchedule {
    id: string;
    procedure_code_id: string;
    effective_date: Date;
    end_date: Date | null;
    fee_amount: number;
    created_at: Date;
    updated_at: Date;
}
