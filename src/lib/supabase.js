import { createClient } from '@supabase/supabase-js';

const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url';

const supabaseUrl = isPlaceholder 
  ? 'https://placeholder-project-id.supabase.co' 
  : process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = isPlaceholder 
  ? 'placeholder-anon-key' 
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { isPlaceholder };
