import "server-only";

import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { sanitizeOAuthReturnPath } from "../contracts/oauth-return-path";
import { AUTH_ERROR_CODES } from "../errors";
import { recordAuthFailure } from "@/lib/observability/auth-monitoring";

export interface HandleOAuthCallbackOptions {
  code: string | null;
  next: string | null;
  error: string | null;
  errorDescription?: string | null;
  requestUrl: string;
}

export interface HandleOAuthCallbackResult {
  success: boolean;
  redirectUrl: string;
  errorCode?: string;
}

/**
 * Handles server-side OAuth callback exchange (P29-T07)
 *
 * Trust Boundary:
 * - Runs exclusively on Server Runtime (`server-only`).
 * - Exchanges PKCE authorization code for session via Supabase SSR.
 * - Writes session cookies directly to HTTP-only cookie store.
 * - Logs failures through privacy-safe `recordAuthFailure` without leaking code, token, or email.
 * - Enforces safe internal return path destination.
 */
export async function handleOAuthCallback({
  code,
  next,
  error,
  errorDescription,
  requestUrl,
}: HandleOAuthCallbackOptions): Promise<HandleOAuthCallbackResult> {
  const baseUrl = new URL(requestUrl);

  // 1. Handle user cancellation or provider rejection
  if (error) {
    const isCancelled =
      error === "access_denied" ||
      error === "user_cancelled" ||
      (errorDescription && errorDescription.toLowerCase().includes("denied"));

    const errorCode = isCancelled
      ? AUTH_ERROR_CODES.AUTH_OAUTH_CANCELLED
      : AUTH_ERROR_CODES.AUTH_OAUTH_PROVIDER_ERROR;

    recordAuthFailure({
      type: isCancelled ? "login_rejected" : "callback_failed",
      errorCode,
      message: isCancelled
        ? "OAuth flow was cancelled by the user"
        : `OAuth provider error occurred: ${error}`,
      route: AUTH_ROUTES.CALLBACK,
    });

    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, baseUrl);
    errorUrl.searchParams.set("code", errorCode);

    return {
      success: false,
      redirectUrl: errorUrl.toString(),
      errorCode,
    };
  }

  // 2. Handle missing authorization code
  if (!code) {
    const errorCode = AUTH_ERROR_CODES.AUTH_OAUTH_CALLBACK_CODE_MISSING;

    recordAuthFailure({
      type: "callback_failed",
      errorCode,
      message: "OAuth callback received without authorization code",
      route: AUTH_ROUTES.CALLBACK,
    });

    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, baseUrl);
    errorUrl.searchParams.set("code", errorCode);

    return {
      success: false,
      redirectUrl: errorUrl.toString(),
      errorCode,
    };
  }

  // 3. Exchange authorization code for Supabase session
  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const errorCode = AUTH_ERROR_CODES.AUTH_OAUTH_SESSION_EXCHANGE_FAILED;

    recordAuthFailure({
      type: "callback_failed",
      errorCode,
      message: "Failed to exchange PKCE authorization code for session",
      route: AUTH_ROUTES.CALLBACK,
      // Error message is safe to log (e.g. 'code expired' or 'invalid code verifier')
      error: exchangeError.message,
    });

    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, baseUrl);
    errorUrl.searchParams.set("code", errorCode);

    return {
      success: false,
      redirectUrl: errorUrl.toString(),
      errorCode,
    };
  }

  // 4. Sanitize destination return path
  const destination = sanitizeOAuthReturnPath(next, DEFAULT_LOGIN_REDIRECT);
  const redirectUrl = new URL(destination, baseUrl);

  return {
    success: true,
    redirectUrl: redirectUrl.toString(),
  };
}
