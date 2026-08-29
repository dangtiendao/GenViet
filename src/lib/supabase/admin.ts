import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { type Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";

/**
 * Creates a privileged Supabase Admin Client using the Service Role Key.
 *
 * CRITICAL SECURITY WARNING:
 * - This client BYPASSES Row Level Security (RLS) policies completely.
 * - MUST NEVER be exposed to the browser or imported in Client Components.
 * - MUST NEVER be used for regular user CRUD requests.
 * - ONLY permitted for background maintenance tasks, cron jobs, or initial system seeding.
 */
export function createAdminClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials: SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be configured on the server."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
