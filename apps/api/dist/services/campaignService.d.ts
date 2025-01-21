import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
export declare class CampaignService {
    private supabase;
    constructor(supabase: SupabaseClient<Database>);
    getAllCampaigns(type?: string, status?: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any[]>>;
    getCampaignById(id: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    createCampaign(data: any): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    updateCampaign(id: string, data: any): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    deleteCampaign(id: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<null>>;
    getCampaignAnalytics(id: string, start_date?: string, end_date?: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any[]>>;
    scheduleCampaign(id: string, schedule_time: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    sendTestCampaign(id: string, test_recipients: string[]): Promise<{
        message: string;
    }>;
    pauseCampaign(id: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
    resumeCampaign(id: string): Promise<import("@supabase/supabase-js").PostgrestSingleResponse<any>>;
}
