import { CURRENT_PUBLIC_PROJECTION_VERSION } from "../privacy/public-projection-version";

export interface PublicTreeCacheKeyParams {
  slug: string;
  publicationVersion: number;
  projectionVersion?: number;
  centerPersonId?: string | null;
  ancestorDepth?: number;
  descendantDepth?: number;
  traversalMode?: string;
  locale?: string;
}

/**
 * Public Cache Namespace Isolation (P30-T42)
 * Ensures public cache is strictly namespaced (`public:tree-graph:...`) and independent of private user sessions.
 */
export function buildPublicTreeCacheKey(params: PublicTreeCacheKeyParams): string {
  const cleanSlug = params.slug.toLowerCase().trim();
  const projectionVersion = params.projectionVersion || CURRENT_PUBLIC_PROJECTION_VERSION;
  const centerId = params.centerPersonId || "root";
  const ancDepth = params.ancestorDepth ?? 2;
  const descDepth = params.descendantDepth ?? 2;
  const mode = params.traversalMode || "PATERNAL_LINE";
  const locale = params.locale || "vi";

  return `public:tree-graph:${cleanSlug}:pub-v${params.publicationVersion}:proj-v${projectionVersion}:c-${centerId}:a${ancDepth}:d${descDepth}:m-${mode}:loc-${locale}`;
}
