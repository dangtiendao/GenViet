/**
 * Supabase Client Integration Boundary (Scaffold Contract)
 *
 * NOTE: Full runtime integration with cookie session handling is implemented in Phase P06 & P09.
 * This module provides typed client factory placeholders adhering to ADR-0004 & ADR-0006.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Creates a browser-side Supabase client using public credentials.
 * Returns null if Supabase environment variables are not yet configured in local scaffold.
 */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}
