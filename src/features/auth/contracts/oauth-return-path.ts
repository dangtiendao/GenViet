import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";

/**
 * OAuth Return Path Contract (P29-T04, P29-T08)
 * Ensures return path (`next` / `redirectTo`) is strictly internal and safe from Open-Redirect.
 */
export function sanitizeOAuthReturnPath(
  rawPath?: string | null,
  fallback: string = DEFAULT_LOGIN_REDIRECT
): string {
  return getSafeRedirectUrl(rawPath, fallback);
}
