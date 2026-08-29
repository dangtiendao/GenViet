import { DEFAULT_LOGIN_REDIRECT } from "./constants";

/**
 * Validates and sanitizes internal redirect URLs to prevent Open-Redirect and CRLF Injection attacks.
 *
 * Rules:
 * 1. Must start with a single leading slash `/`.
 * 2. Must NOT start with `//` (protocol-relative URL).
 * 3. Must NOT contain schema prefixes like `http:`, `https:`, `javascript:`, `data:`, etc.
 * 4. Must NOT contain CRLF characters (`\r`, `\n`).
 * 5. Returns `fallback` if invalid.
 */
export function getSafeRedirectUrl(
  target?: string | null,
  fallback: string = DEFAULT_LOGIN_REDIRECT
): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();

  // Reject empty string
  if (!trimmed) {
    return fallback;
  }

  // Reject CRLF injection
  if (/[\r\n]/.test(trimmed)) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. //attacker.com)
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject explicit protocols (http:, https:, javascript:, data:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Must start with single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Prevent backslash tricks (e.g. /\attacker.com)
  if (trimmed.startsWith("/\\")) {
    return fallback;
  }

  return trimmed;
}
