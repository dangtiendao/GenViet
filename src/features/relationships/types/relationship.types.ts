import type { Database } from "@/lib/supabase/database.types";
import type { PartialDateValue } from "@/components/forms/partial-date-input";

export type ParentRole = Database["public"]["Enums"]["parent_role_type"];
export type RelationshipKind = Database["public"]["Enums"]["relationship_kind_type"];
export type VerificationStatus = Database["public"]["Enums"]["verification_status_type"];
export type UnionStatus = Database["public"]["Enums"]["union_status_type"];
export type UnionMemberRole = Database["public"]["Enums"]["union_member_role_type"];

export type RelationActionType =
  | "add_father"
  | "add_mother"
  | "add_adoptive_parent"
  | "add_spouse"
  | "add_child"
  | "add_sibling"
  | "link_father"
  | "link_mother"
  | "link_adoptive_parent"
  | "link_spouse"
  | "link_child"
  | "link_sibling";

export interface ParentWithDetails {
  id: string;
  parentId: string;
  parentName: string;
  parentRole: ParentRole;
  gender: Database["public"]["Enums"]["gender_type"];
  livingStatus: Database["public"]["Enums"]["living_status_type"];
}

export interface SpouseWithDetails {
  id: string;
  spouseId: string;
  spouseName: string;
  gender: Database["public"]["Enums"]["gender_type"];
  livingStatus: Database["public"]["Enums"]["living_status_type"];
  unionId: string;
  unionStatus: UnionStatus;
}

export interface ParentChildRelationship {
  id: string;
  treeId: string;
  parentId: string;
  childId: string;
  parentRole: ParentRole;
  relationshipKind: RelationshipKind;
  verificationStatus: VerificationStatus;
  notes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UnionEntity {
  id: string;
  treeId: string;
  status: UnionStatus;
  startDate: string | null;
  startYear: number | null;
  startDatePrecision: "exact" | "year" | "unknown";
  endDate: string | null;
  endYear: number | null;
  endDatePrecision: "exact" | "year" | "unknown";
  notes: string | null;
  verificationStatus: VerificationStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UnionMemberEntity {
  id: string;
  treeId: string;
  unionId: string;
  personId: string;
  memberRole: UnionMemberRole;
  createdAt: string;
  deletedAt: string | null;
}

export interface RelatedPersonCandidate {
  id: string;
  fullName: string;
  gender: Database["public"]["Enums"]["gender_type"];
  livingStatus: Database["public"]["Enums"]["living_status_type"];
  birthYear: number | null;
  birthDate: string | null;
}

export interface RelationshipPreviewData {
  subjectPersonName: string;
  relatedPersonName: string;
  actionType: RelationActionType;
  relationshipKind: RelationshipKind;
  parentRole?: ParentRole;
  verificationStatus: VerificationStatus;
  unionStatus?: UnionStatus;
  summaryText: string;
  warningText?: string;
  isBlocking: boolean;
  blockingReason?: string;
}
