import { createClient } from '@supabase/supabase-js';
import { logger } from '../lib/logger';
export const initSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        logger.error('Supabase configuration missing');
        process.exit(1);
    }
    try {
        return createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        });
    }
    catch (error) {
        logger.error('Supabase client initialization failed', { error });
        process.exit(1);
    }
};
