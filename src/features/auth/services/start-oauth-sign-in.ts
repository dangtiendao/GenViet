import { createClient } from "@/lib/supabase/client";
import {
  isSupportedOAuthProvider,
  GOOGLE_OAUTH_SCOPES,
  type OAuthProvider,
} from "../contracts/auth-provider";
import { sanitizeOAuthReturnPath } from "../contracts/oauth-return-path";
import { AUTH_ERROR_CODES, mapAuthError, type AuthErrorDetail } from "../errors";
import { getAuthCallbackUrl } from "@/config/env";
import { type ActionResult } from "../actions";

export interface StartOAuthSignInOptions {
  provider: OAuthProvider;
  next?: string | null;
}

/**
 * Initiates OAuth Authentication flow using Supabase Auth (PKCE flow) (P29-T06)
 *
 * Trust Boundary:
 * - Runs in Client Browser Runtime.
 * - Validates provider against strict typed allowlist (`OAUTH_PROVIDERS`).
 * - Constructs callback URL using trusted origin (`getAppOrigin()` / `getAuthCallbackUrl()`).
 * - Sanitizes return path (`next`) to prevent Open-Redirect vulnerabilities.
 * - Requests ONLY minimal scopes (`openid email profile`).
 */
export async function startOAuthSignIn({
  provider,
  next,
}: StartOAuthSignInOptions): Promise<ActionResult<{ url?: string }>> {
  // 1. Validate Provider Allowlist
  if (!isSupportedOAuthProvider(provider)) {
    return {
      success: false,
      errorCode: AUTH_ERROR_CODES.AUTH_PROVIDER_UNSUPPORTED,
      message: "Phương thức đăng nhập không được hỗ trợ.",
    };
  }

  try {
    // 2. Sanitize return path and construct trusted callback URL
    const safeNext = sanitizeOAuthReturnPath(next);
    const callbackUrl = getAuthCallbackUrl(safeNext);

    // 3. Initiate Supabase PKCE OAuth sign-in
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: callbackUrl,
        scopes: GOOGLE_OAUTH_SCOPES,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      const errorDetail: AuthErrorDetail = mapAuthError(error);
      return {
        success: false,
        errorCode: errorDetail.code,
        message: errorDetail.messageVi,
      };
    }

    return {
      success: true,
      data: {
        url: data?.url ?? undefined,
      },
    };
  } catch (err) {
    const errorDetail = mapAuthError(err);
    return {
      success: false,
      errorCode: errorDetail.code || AUTH_ERROR_CODES.AUTH_GOOGLE_INIT_FAILED,
      message: errorDetail.messageVi || "Không thể khởi tạo đăng nhập Google. Vui lòng thử lại.",
    };
  }
}
