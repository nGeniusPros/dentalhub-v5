import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

interface ImportMetaEnv {
		VITE_SUPABASE_URL: string;
		VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
		readonly env: ImportMetaEnv;
}

declare const import: ImportMeta;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);