import { clearAllPrivateCaches } from "@/features/pwa/services/private-cache-cleanup";
import { createClient } from "@/lib/supabase/client";

/**
 * Complete Client Session & Cache Cleanup (P20-T09, P29-T16)
 *
 * Responsibilities:
 * 1. Purges client sessionStorage.
 * 2. Purges all Service Worker private caches (`genviet-private-*`).
 * 3. Signs out from Supabase client in browser runtime.
 * 4. Ensures zero residual private state on logout or account switch.
 */
export async function performClientSessionCleanup(): Promise<void> {
  try {
    // 1. Clear private browser/SW caches & sessionStorage
    await clearAllPrivateCaches();

    // 2. Sign out from client-side Supabase if running in browser
    if (typeof window !== "undefined") {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (authErr) {
        console.warn("[session-cleanup] Supabase client sign-out notice:", authErr);
      }
    }
  } catch (err) {
    console.warn("[session-cleanup] Session cleanup encountered an error:", err);
  }
}
