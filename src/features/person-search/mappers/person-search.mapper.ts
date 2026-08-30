import type {
  PersonSearchResultItem,
  PersonSearchResponse,
  PersonSearchFilters,
  ParentSummary,
} from "../types/person-search.types";
import { encodeSearchCursor } from "../utils/search-cursor";

export interface RawSearchRow {
  id: string;
  tree_id: string;
  full_name: string;
  normalized_name: string;
  gender: "male" | "female" | "other" | "unknown";
  living_status: "living" | "deceased" | "unknown";
  birth_date: string | null;
  birth_year: number | null;
  birth_date_precision: "exact" | "year" | "unknown";
  birth_is_estimated: boolean;
  death_date: string | null;
  death_year: number | null;
  death_date_precision: "exact" | "year" | "unknown";
  death_is_estimated: boolean;
  hometown_text: string | null;
  occupation_text: string | null;
  verification_status: "verified" | "unverified" | "disputed";
  avatar_path?: string | null;
  parents_json: ParentSummary[] | null;
  match_tier: number;
  similarity_score: number;
}

export function mapRawRowToPersonSearchResult(row: RawSearchRow): PersonSearchResultItem {
  return {
    id: row.id,
    treeId: row.tree_id,
    fullName: row.full_name,
    normalizedName: row.normalized_name,
    gender: row.gender,
    livingStatus: row.living_status,
    birthDate: row.birth_date,
    birthYear: row.birth_year,
    birthDatePrecision: row.birth_date_precision,
    birthIsEstimated: row.birth_is_estimated,
    deathDate: row.death_date,
    deathYear: row.death_year,
    deathDatePrecision: row.death_date_precision,
    deathIsEstimated: row.death_is_estimated,
    hometownText: row.hometown_text,
    occupationText: row.occupation_text,
    verificationStatus: row.verification_status,
    avatarPath: row.avatar_path || null,
    parents: Array.isArray(row.parents_json) ? row.parents_json : [],
    matchTier: row.match_tier,
    similarityScore: row.similarity_score,
  };
}

export function mapSearchResultsToResponse(
  rawRows: RawSearchRow[],
  limit: number,
  appliedFilters: PersonSearchFilters,
  normalizedQuery: string
): PersonSearchResponse {
  const hasNextPage = rawRows.length === limit;
  const results = rawRows.map(mapRawRowToPersonSearchResult);

  let nextCursor: string | null = null;
  if (hasNextPage && results.length > 0) {
    const last = results[results.length - 1];
    nextCursor = encodeSearchCursor({
      rankTier: last.matchTier,
      similarity: last.similarityScore,
      normalizedName: last.normalizedName,
      birthYear: last.birthYear,
      id: last.id,
    });
  }

  return {
    results,
    nextCursor,
    hasNextPage,
    appliedFilters,
    normalizedQuery,
    count: results.length,
  };
}
