import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
export declare class PatientService {
    protected supabase: SupabaseClient<Database>;
    protected sikkaApi: import("axios").AxiosInstance;
    constructor(supabase: SupabaseClient<Database>);
    createPatient(input: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        address: string;
        medicalHistory?: string;
    }): Promise<{
        data: any;
        error: any;
    }>;
    getPatient(id: string): Promise<{
        data: any;
        error: any;
    }>;
    updatePatient(id: string, input: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        dateOfBirth?: string;
        address?: string;
        medicalHistory?: string;
    }): Promise<{
        data: any;
        error: any;
    }>;
    deletePatient(id: string): Promise<{
        error: any;
    }>;
    getPatientFamilyMembers(patientId: string): Promise<{
        data: any;
        error: any;
    }>;
    addFamilyMember(patientId: string, input: {
        related_patient_id: string;
        relationship_type: string;
    }): Promise<{
        data: any;
        error: any;
    }>;
    uploadPatientDocument(patientId: string, file: any, type: string, description: string): Promise<{
        error: any;
        data?: undefined;
    } | {
        data: any;
        error: any;
    }>;
    getPatientDocuments(patientId: string): Promise<{
        data: any;
        error: any;
    }>;
    updatePatientMedicalHistory(patientId: string, medicalHistory: string): Promise<{
        data: any;
        error: any;
    }>;
    createTreatmentPlan(patientId: string, input: {
        title: string;
        description: string;
        procedures: any[];
        estimated_cost: number;
        duration: string;
    }): Promise<{
        data: any;
        error: any;
    }>;
    getPatientTreatmentPlans(patientId: string): Promise<{
        data: any;
        error: any;
    }>;
    syncPatientsFromSikka(): Promise<void>;
}
