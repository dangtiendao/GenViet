/**
 * Supabase Module Entry Point
 *
 * Provides typed client factories adhering to ADR-0004 & ADR-0006:
 * - Browser Client: `createBrowserClient` from `@/lib/supabase/client`
 * - Server Client: `createServerClient` from `@/lib/supabase/server`
 * - Admin Client (Server-Only): `createAdminClient` from `@/lib/supabase/admin`
 */

export * from "@/lib/supabase/database.types";
export { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
