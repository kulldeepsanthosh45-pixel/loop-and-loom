import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase admin client.
 * Only import this in API routes, server actions, or route handlers —
 * never in client components. Uses the anon key (safe for read operations).
 * Swap to service_role key if you need to bypass RLS for admin operations.
 */
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
