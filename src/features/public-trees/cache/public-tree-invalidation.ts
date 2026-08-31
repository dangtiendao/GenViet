/**
 * Public Cache Invalidation Manager (P30-T43)
 * Tracks invalidated slugs and timestamps for public tree responses.
 */

const invalidatedSlugs = new Set<string>();

export function invalidatePublicTreeCache(slug: string): void {
  if (!slug) return;
  const cleanSlug = slug.toLowerCase().trim();
  invalidatedSlugs.add(cleanSlug);
}

export function isPublicTreeCacheInvalidated(slug: string): boolean {
  if (!slug) return false;
  return invalidatedSlugs.has(slug.toLowerCase().trim());
}

export function clearInvalidationStatus(slug: string): void {
  if (!slug) return;
  invalidatedSlugs.delete(slug.toLowerCase().trim());
}
