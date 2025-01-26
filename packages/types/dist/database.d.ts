import type { SupabaseClient } from "@supabase/supabase-js";
export interface DatabasePatient {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    status: "active" | "inactive" | "pending";
    balance: number;
    date_of_birth: string | null;
    address: string | null;
    insurance_id: string | null;
    created_at: string;
    updated_at: string;
}
export interface DatabaseAppointment {
    id: string;
    patient_id: string;
    provider_id: string;
    start_time: string;
    end_time: string;
    status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
    type: "checkup" | "cleaning" | "procedure" | "consultation" | "emergency";
    notes: string | null;
    created_at: string;
    updated_at: string;
}
export interface DatabaseProvider {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    role: "dentist" | "hygienist" | "assistant" | "admin";
    status: "active" | "inactive";
    specialties: string[] | null;
    schedule: {
        monday?: {
            start: string;
            end: string;
        }[];
        tuesday?: {
            start: string;
            end: string;
        }[];
        wednesday?: {
            start: string;
            end: string;
        }[];
        thursday?: {
            start: string;
            end: string;
        }[];
        friday?: {
            start: string;
            end: string;
        }[];
        saturday?: {
            start: string;
            end: string;
        }[];
        sunday?: {
            start: string;
            end: string;
        }[];
    } | null;
    created_at: string;
    updated_at: string;
}
export interface DatabaseProcedure {
    id: string;
    appointment_id: string;
    code: string;
    name: string;
    description: string | null;
    cost: number;
    insurance_code: string | null;
    duration: number;
    status: "planned" | "in-progress" | "completed" | "cancelled";
    notes: string | null;
    created_at: string;
    updated_at: string;
}
export interface DatabaseInsurance {
    id: string;
    patient_id: string;
    provider: string;
    policy_number: string;
    group_number: string | null;
    primary: boolean;
    coverage_start: string;
    coverage_end: string | null;
    verification_status: "pending" | "verified" | "failed";
    coverage_details: {
        deductible?: number;
        maximum?: number;
        copay?: number;
        coinsurance?: number;
    } | null;
    created_at: string;
    updated_at: string;
}
export interface DatabaseBilling {
    id: string;
    patient_id: string;
    appointment_id: string | null;
    procedure_id: string | null;
    amount: number;
    status: "pending" | "paid" | "partially_paid" | "overdue" | "cancelled";
    due_date: string;
    insurance_claim_id: string | null;
    payment_method: "cash" | "card" | "insurance" | "other" | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
export interface Database {
    public: {
        Tables: {
            patients: {
                Row: DatabasePatient;
                Insert: Omit<DatabasePatient, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabasePatient, "id" | "created_at" | "updated_at">>;
            };
            appointments: {
                Row: DatabaseAppointment;
                Insert: Omit<DatabaseAppointment, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabaseAppointment, "id" | "created_at" | "updated_at">>;
            };
            providers: {
                Row: DatabaseProvider;
                Insert: Omit<DatabaseProvider, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabaseProvider, "id" | "created_at" | "updated_at">>;
            };
            procedures: {
                Row: DatabaseProcedure;
                Insert: Omit<DatabaseProcedure, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabaseProcedure, "id" | "created_at" | "updated_at">>;
            };
            insurance: {
                Row: DatabaseInsurance;
                Insert: Omit<DatabaseInsurance, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabaseInsurance, "id" | "created_at" | "updated_at">>;
            };
            billing: {
                Row: DatabaseBilling;
                Insert: Omit<DatabaseBilling, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<DatabaseBilling, "id" | "created_at" | "updated_at">>;
            };
        };
        Views: {
            [key: string]: {
                Row: Record<string, unknown>;
                Insert: Record<string, unknown>;
                Update: Record<string, unknown>;
            };
        };
        Functions: {
            [key: string]: unknown;
        };
        Enums: {
            [key: string]: unknown;
        };
    };
}
export type SupabaseDatabase = SupabaseClient<Database>;
//# sourceMappingURL=database.d.ts.map