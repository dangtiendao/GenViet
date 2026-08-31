import type { PublicPersonDto } from "./public-person.dto";
import type { PublicHiddenReason } from "./public-hidden-reason";

export interface PublicParentChildRelationshipDto {
  id: string;
  parentId: string;
  childId: string;
  parentRole: "father" | "mother" | "unspecified";
  relationshipKind: "biological" | "adoptive" | "step" | "foster";
  verificationStatus: "unverified" | "verified" | "disputed";
}

export interface PublicUnionDto {
  id: string;
  status: "active" | "separated" | "divorced" | "widowed" | "former";
  verificationStatus: "unverified" | "verified" | "disputed";
}

export interface PublicUnionMemberDto {
  unionId: string;
  personId: string;
  memberRole: "spouse" | "partner" | "unspecified";
}

export interface PublicNodeExpansionMetadata {
  hasMoreAncestors: boolean;
  hasMoreDescendants: boolean;
  hiddenReason?: PublicHiddenReason;
}

export interface PublicGraphDto {
  schemaVersion: number;
  tree: {
    id: string;
    slug: string;
    name: string;
    publicationVersion: number;
    privacyProjectionVersion: number;
  };
  centerPersonId: string | null;
  persons: PublicPersonDto[];
  parentChildRelationships: PublicParentChildRelationshipDto[];
  unions: PublicUnionDto[];
  unionMembers: PublicUnionMemberDto[];
  expansion: Record<string, PublicNodeExpansionMetadata>;
  limits: {
    requestedAncestorDepth?: number;
    requestedDescendantDepth?: number;
    appliedAncestorDepth?: number;
    appliedDescendantDepth?: number;
    maxAncestorDepth: number;
    maxDescendantDepth: number;
    returnedPersonCount: number;
    traversalMode: string;
    truncated: boolean;
  };
}
