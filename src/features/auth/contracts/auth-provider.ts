/**
 * Authentication Provider Contract and Allowlist
 * Phase: P29 (Google OAuth Login)
 */

export const OAUTH_PROVIDERS = ["google"] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const AUTH_METHODS = ["password", "google"] as const;

export type AuthMethod = (typeof AUTH_METHODS)[number];

/**
 * Validates if the given provider is an authorized OAuth provider in GenViet
 */
export function isSupportedOAuthProvider(provider: unknown): provider is OAuthProvider {
  return typeof provider === "string" && (OAUTH_PROVIDERS as readonly string[]).includes(provider);
}

/**
 * Standard minimal OAuth scopes for Google Authentication
 * Least privilege: openid, email, profile
 */
export const GOOGLE_OAUTH_SCOPES = "openid email profile" as const;
