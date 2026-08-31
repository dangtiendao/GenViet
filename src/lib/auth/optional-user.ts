import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface OptionalUserContext {
  user: {
    id: string;
    email?: string;
  } | null;
}

/**
 * Non-blocking authentication check for public routes.
 * Does NOT redirect unauthenticated guests.
 */
export async function getOptionalUser(): Promise<OptionalUserContext> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch {
    return { user: null };
  }
}
