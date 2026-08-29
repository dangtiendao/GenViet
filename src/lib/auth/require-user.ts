import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "./constants";
import { type Database } from "@/lib/supabase/database.types";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface AuthenticatedContext {
  user: {
    id: string;
    email?: string;
    user_metadata: Record<string, unknown>;
  };
  profile: UserProfile | null;
}

/**
 * Server-side authentication guard for Server Components and Server Actions.
 *
 * Enforces:
 * - Direct verification with Supabase Auth Server via `getUser()`.
 * - Profile lookup in `public.profiles` protected by RLS `profiles_select_own`.
 * - Redirects unauthenticated requests to `/login`.
 */
export async function requireUser(): Promise<AuthenticatedContext> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`${AUTH_ROUTES.LOGIN}?next=${encodeURIComponent(AUTH_ROUTES.DASHBOARD)}`);
  }

  // Fetch associated profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: (user.user_metadata as Record<string, unknown>) || {},
    },
    profile: profile || null,
  };
}
