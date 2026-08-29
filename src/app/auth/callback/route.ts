import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";
import { AUTH_ERROR_CODES } from "@/features/auth/errors";

/**
 * PKCE & OAuth Auth Callback Route Handler (P09-T02, P09-T15, P09-T18)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle provider error callback (e.g. user canceled OAuth)
  if (error) {
    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, request.url);
    errorUrl.searchParams.set("code", AUTH_ERROR_CODES.AUTH_PROVIDER_ERROR);
    return NextResponse.redirect(errorUrl);
  }

  // If code is missing, redirect to auth error
  if (!code) {
    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, request.url);
    errorUrl.searchParams.set("code", AUTH_ERROR_CODES.AUTH_CALLBACK_INVALID);
    return NextResponse.redirect(errorUrl);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, request.url);
    errorUrl.searchParams.set("code", AUTH_ERROR_CODES.AUTH_CALLBACK_INVALID);
    return NextResponse.redirect(errorUrl);
  }

  // Safe redirect destination (prevents open-redirect)
  const destination = getSafeRedirectUrl(next, DEFAULT_LOGIN_REDIRECT);
  const redirectUrl = new URL(destination, request.url);

  return NextResponse.redirect(redirectUrl);
}
