import type { PersonSearchQueryParams } from "../types/person-search.types";
import { normalizeVietnamese } from "../utils/normalize-vietnamese";

export function buildPersonSearchCacheKey(params: PersonSearchQueryParams): string {
  const normQuery = normalizeVietnamese(params.query);
  const by = params.birthYear ? String(params.birthYear) : "any";
  const ls = params.livingStatus || "all";
  const mi = params.missingInformation || "none";
  const cur = params.cursor || "init";
  const lim = params.limit || 20;

  return `genviet:search:tree:${params.treeId}:q:${normQuery}:by:${by}:ls:${ls}:mi:${mi}:cur:${cur}:lim:${lim}`;
}
