import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
export declare class AppointmentService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    getAllAppointments(start_date?: string, end_date?: string, status?: string, provider_id?: string, patient_id?: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any[]>>;
    getAppointmentById(id: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    createAppointment(data: any, userId: string | undefined): Promise<any>;
    updateAppointment(id: string, data: any): Promise<any>;
    cancelAppointment(id: string, reason: string, userId: string | undefined): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    addCommentToAppointment(id: string, content: string, userId: string | undefined): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
}
