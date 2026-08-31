import type { LivingPersonPolicy, SearchEngineVisibility } from "./tree-visibility";

/**
 * Allowlisted Public Family Tree Summary DTO (P30-T18)
 * Strips internal owner ID, membership details, admin notes, billing info.
 */
export interface PublicTreeDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  rootPersonId: string | null;
  generationAnchorPersonId: string | null;
  publicationVersion: number;
  privacyProjectionVersion: number;
  searchEngineVisibility: SearchEngineVisibility;
  livingPersonPolicy: LivingPersonPolicy;
  publishedAt: string | null;
  publicUpdatedAt: string | null;
}
