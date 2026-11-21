import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
  );
}

/** Browser / client-side Supabase client (anon key) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Helper: check if Supabase is reachable */
export async function pingSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_health').select('1').limit(1);
    return !error;
  } catch {
    return false;
  }
}
