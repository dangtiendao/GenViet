import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";

/**
 * Creates a typed Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Trust Boundary:
 * - Runs exclusively in Node.js / Server Runtime (`server-only`).
 * - Manages user authentication session via HTTP-Only Secure Cookies.
 * - Enforces Row Level Security (RLS) policies scoped to the authenticated user.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured in .env.local"
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
