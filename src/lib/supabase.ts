import { createClient } from '@supabase/supabase-js';

// These will need to be provided in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Authentication and database features will not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
