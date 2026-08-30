/**
 * Authentication Constants and Route Paths
 * Phase: P09 (User Authentication)
 */

export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  UPDATE_PASSWORD: "/update-password",
  VERIFY_EMAIL: "/verify-email",
  AUTH_ERROR: "/auth-error",
  CALLBACK: "/auth/callback",
  CONFIRM: "/auth/confirm",
  DASHBOARD: "/dashboard",
  ACCOUNT: "/account",
} as const;

export const DEFAULT_LOGIN_REDIRECT = AUTH_ROUTES.DASHBOARD;
export const DEFAULT_UNAUTHENTICATED_REDIRECT = AUTH_ROUTES.LOGIN;

export const PUBLIC_AUTH_PATHS: readonly string[] = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGN_UP,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.UPDATE_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
  AUTH_ROUTES.AUTH_ERROR,
  AUTH_ROUTES.CALLBACK,
  AUTH_ROUTES.CONFIRM,
  "/api/health",
  "/",
] as const;

export const PROTECTED_PATHS_PREFIXES: readonly string[] = [
  "/dashboard",
  "/account",
  "/trees",
  "/admin",
  "/search",
] as const;

export const AUTH_COOKIE_NAMES = {
  AUTH_TOKEN: "sb-auth-token",
} as const;
