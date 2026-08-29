import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";
import { AUTH_ERROR_CODES } from "@/features/auth/errors";

/**
 * Email Confirmation & Recovery OTP Route Handler (P09-T02, P09-T06)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (!token_hash || !type) {
    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, request.url);
    errorUrl.searchParams.set("code", AUTH_ERROR_CODES.AUTH_CONFIRMATION_INVALID);
    return NextResponse.redirect(errorUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    const errorUrl = new URL(AUTH_ROUTES.AUTH_ERROR, request.url);
    errorUrl.searchParams.set(
      "code",
      type === "recovery"
        ? AUTH_ERROR_CODES.AUTH_RECOVERY_EXPIRED
        : AUTH_ERROR_CODES.AUTH_CONFIRMATION_EXPIRED
    );
    return NextResponse.redirect(errorUrl);
  }

  const destination = getSafeRedirectUrl(next, DEFAULT_LOGIN_REDIRECT);
  return NextResponse.redirect(new URL(destination, request.url));
}
