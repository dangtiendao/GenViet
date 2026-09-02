import type { PublicMediaDto } from "./public-media.dto";

/**
 * Allowlisted Public Person DTO (P30-T19)
 * Living individuals have full birth date, exact birth place, biography, contact info redacted.
 */
export interface PublicPersonDto {
  id: string;
  displayName: string;
  gender: "male" | "female" | "other" | "unknown";
  livingState: "LIVING" | "DECEASED" | "UNKNOWN";
  birthYear: number | null;
  deathYear: number | null;
  isEstimated: boolean;
  isCenter?: boolean;
  publicThumbnail?: PublicMediaDto | null;
  visibility: "PUBLIC" | "PUBLIC_REDACTED";
}

/**
 * Allowlisted Public Person Profile DTO for Detail sheet
 */
export interface PublicPersonProfileDto extends PublicPersonDto {
  treeSlug: string;
  treeName: string;
  father?: { id: string; displayName: string } | null;
  mother?: { id: string; displayName: string } | null;
  spouses: Array<{
    id: string;
    displayName: string;
    gender: string;
    livingState: string;
  }>;
  children: Array<{
    id: string;
    displayName: string;
    gender: string;
    livingState: string;
    birthYear?: number | null;
  }>;
  siblings?: Array<{
    id: string;
    displayName: string;
    gender: string;
    livingState: string;
    birthYear?: number | null;
  }>;
}
