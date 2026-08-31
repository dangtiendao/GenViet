import { type NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/features/auth/services/handle-oauth-callback";

/**
 * PKCE & OAuth Auth Callback Route Handler (P09-T02, P09-T15, P09-T18, P29-T07)
 *
 * Security:
 * - Emits `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate` to prevent any intermediary/PWA caching.
 * - Exchanges authorization code via server-side Supabase client.
 * - Protects against open-redirect vulnerabilities by validating `next` destination path.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  const result = await handleOAuthCallback({
    code,
    next,
    error,
    errorDescription,
    requestUrl: request.url,
  });

  const response = NextResponse.redirect(new URL(result.redirectUrl, request.url));

  // Enforce no-cache policy on auth callback responses (AC-P29-019, AC-P29-079)
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
