import { SupabaseClient } from "@supabase/supabase-js";
export type Database = {
    public: {
        Tables: {
            campaigns: {
                Row: {
                    id: string;
                    name: string;
                    type: string;
                    status: string;
                    metrics: {
                        total: number;
                        sent: number;
                        delivered: number;
                        engaged: number;
                        failed: number;
                    };
                    createdAt: Date;
                    updatedAt: Date;
                };
                Insert: {
                    id?: string;
                    name: string;
                    type: string;
                    status?: string;
                    metrics?: {
                        total: number;
                        sent: number;
                        delivered: number;
                        engaged: number;
                        failed: number;
                    };
                    createdAt?: Date;
                    updatedAt?: Date;
                };
                Update: {
                    id?: string;
                    name?: string;
                    type?: string;
                    status?: string;
                    metrics?: {
                        total?: number;
                        sent?: number;
                        delivered?: number;
                        engaged?: number;
                        failed?: number;
                    };
                    createdAt?: Date;
                    updatedAt?: Date;
                };
            };
        };
    };
};
export type Supabase = SupabaseClient<Database>;
export declare const createDatabaseClient: (url: string, key: string) => Supabase;
//# sourceMappingURL=types.d.ts.map