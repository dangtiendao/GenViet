export type LivingStatusFilter = "all" | "living" | "deceased" | "unknown";

export type MissingInformationFilter =
  "none" | "missing_birth" | "missing_death_for_deceased" | "missing_hometown" | "missing_any_core";

export interface ParentSummary {
  id: string;
  fullName: string;
  parentRole: "father" | "mother" | "parent" | "unspecified";
  relationshipKind: "biological" | "adoptive" | "foster" | "step" | "unknown";
  verificationStatus: "verified" | "unverified" | "disputed";
}

export interface PersonSearchResultItem {
  id: string;
  treeId: string;
  fullName: string;
  normalizedName: string;
  gender: "male" | "female" | "other" | "unknown";
  livingStatus: "living" | "deceased" | "unknown";
  birthDate: string | null;
  birthYear: number | null;
  birthDatePrecision: "exact" | "year" | "unknown";
  birthIsEstimated: boolean;
  deathDate: string | null;
  deathYear: number | null;
  deathDatePrecision: "exact" | "year" | "unknown";
  deathIsEstimated: boolean;
  hometownText: string | null;
  occupationText: string | null;
  verificationStatus: "verified" | "unverified" | "disputed";
  avatarPath?: string | null;
  parents: ParentSummary[];
  matchTier: number;
  similarityScore: number;
}

export interface PersonSearchFilters {
  query?: string;
  birthYear?: number | null;
  livingStatus?: LivingStatusFilter;
  missingInformation?: MissingInformationFilter;
}

export interface PersonSearchQueryParams extends PersonSearchFilters {
  treeId: string;
  cursor?: string | null;
  limit?: number;
}

export interface PersonSearchResponse {
  results: PersonSearchResultItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
  appliedFilters: PersonSearchFilters;
  normalizedQuery: string;
  count: number;
}
