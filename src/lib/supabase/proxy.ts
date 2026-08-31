import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { type Database } from "./database.types";
import { env } from "@/lib/env";
import {
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  PROTECTED_PATHS_PREFIXES,
  PUBLIC_AUTH_PATHS,
} from "@/lib/auth/constants";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";

/**
 * Updates user session cookie on incoming requests and enforces preliminary routing logic.
 * Next.js 16 App Router Proxy (P09-T07, P09-T08, P09-T09).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
  const supabaseAnonKey =
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM0MTI4MDB9.dummy_key";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT run heavy business queries in Proxy. Only call getUser() for token refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isGetRequest = request.method === "GET";
  const isServerAction = request.headers.has("next-action") || request.headers.has("x-action");

  // NOTE: If request is a Server Action or non-GET mutation, never intercept with a middleware redirect.
  // Next.js App Router Server Action dispatcher handles execution, errors, and redirects internally.
  if (isServerAction || !isGetRequest) {
    return supabaseResponse;
  }

  // 1. Unauthenticated users trying to access protected routes via GET -> redirect to login with next param
  const isProtectedPath = PROTECTED_PATHS_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!user && isProtectedPath) {
    const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
    const safeNext = getSafeRedirectUrl(pathname + request.nextUrl.search, DEFAULT_LOGIN_REDIRECT);
    loginUrl.searchParams.set("next", safeNext);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users opening login or sign-up via GET -> redirect to dashboard
  const isAuthEntryPage = pathname === AUTH_ROUTES.LOGIN || pathname === AUTH_ROUTES.SIGN_UP;
  if (user && isAuthEntryPage) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const targetUrl = new URL(getSafeRedirectUrl(nextParam, DEFAULT_LOGIN_REDIRECT), request.url);
    return NextResponse.redirect(targetUrl);
  }

  return supabaseResponse;
}
