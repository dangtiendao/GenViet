/**
 * Tree Visibility, Publication Model & Slug Contracts (P30-T02, P30-T08, P30-T09)
 */

export type TreeVisibility = "PRIVATE" | "UNLISTED" | "PUBLIC";

export type SearchEngineVisibility = "NOINDEX" | "INDEX";

export type LivingPersonPolicy = "REDACTED" | "STRICT";

export type PersonPublicVisibility = "INHERIT_TREE" | "PRIVATE" | "PUBLIC_REDACTED" | "PUBLIC";

export type MediaPublicVisibility = "PRIVATE" | "PUBLIC_THUMBNAIL" | "PUBLIC_FULL";

export const DEFAULT_TREE_VISIBILITY: TreeVisibility = "PRIVATE";
export const DEFAULT_SEARCH_ENGINE_VISIBILITY: SearchEngineVisibility = "NOINDEX";
export const DEFAULT_LIVING_PERSON_POLICY: LivingPersonPolicy = "REDACTED";
export const DEFAULT_PERSON_PUBLIC_VISIBILITY: PersonPublicVisibility = "INHERIT_TREE";

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "auth",
  "dashboard",
  "public",
  "trees",
  "person",
  "people",
  "settings",
  "account",
  "login",
  "signup",
  "sign-up",
  "logout",
  "help",
  "terms",
  "privacy",
  "legal",
  "root",
  "health",
  "heartbeat",
  "backup",
  "search",
  "graph",
  "media",
  "storage",
  "system",
  "null",
  "undefined",
] as const;

export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 60;

/**
 * Normalizes a raw string into a valid kebab-case slug
 */
export function normalizeSlug(raw: string): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
    .slice(0, MAX_SLUG_LENGTH);
}

/**
 * Validates whether a slug matches all format and reserved word rules
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length < MIN_SLUG_LENGTH || slug.length > MAX_SLUG_LENGTH) return false;
  if (!SLUG_REGEX.test(slug)) return false;
  if (RESERVED_SLUGS.includes(slug.toLowerCase() as (typeof RESERVED_SLUGS)[number])) return false;
  return true;
}
