import { createBrowserClient } from "@supabase/ssr";
import { type Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";

/**
 * Creates a typed Supabase client for Client Components (Browser Runtime).
 *
 * Trust Boundary:
 * - Uses ONLY public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * - Requests are subject to Row Level Security (RLS) policies evaluated in PostgreSQL.
 * - NEVER import or reference server-only secrets in this module.
 */
export function createClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured in .env.local"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
