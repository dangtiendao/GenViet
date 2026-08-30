import type { Database } from "@/lib/supabase/database.types";

export type GenderType = Database["public"]["Enums"]["gender_type"];
export type LivingStatusType = Database["public"]["Enums"]["living_status_type"];
export type DatePrecisionType = Database["public"]["Enums"]["date_precision_type"];
export type VerificationStatusType = Database["public"]["Enums"]["verification_status_type"];
export type ParentRoleType = Database["public"]["Enums"]["parent_role_type"];
export type RelationshipKindType = Database["public"]["Enums"]["relationship_kind_type"];
export type UnionMemberRoleType = Database["public"]["Enums"]["union_member_role_type"];

export interface Person {
  id: string;
  treeId: string;
  fullName: string;
  normalizedName: string;
  gender: GenderType;
  livingStatus: LivingStatusType;
  birthDate: string | null;
  birthYear: number | null;
  birthDatePrecision: DatePrecisionType;
  birthIsEstimated: boolean;
  deathDate: string | null;
  deathYear: number | null;
  deathDatePrecision: DatePrecisionType;
  deathIsEstimated: boolean;
  birthPlaceText: string | null;
  deathPlaceText: string | null;
  hometownText: string | null;
  burialPlaceText: string | null;
  occupationText: string | null;
  biography: string | null;
  verificationStatus: VerificationStatusType;
  avatarPath: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
}

export interface PersonListItem {
  id: string;
  treeId: string;
  fullName: string;
  gender: GenderType;
  livingStatus: LivingStatusType;
  birthYear: number | null;
  birthDate: string | null;
  birthDatePrecision: DatePrecisionType;
  birthIsEstimated: boolean;
  deathYear: number | null;
  deathDate: string | null;
  deathDatePrecision: DatePrecisionType;
  deathIsEstimated: boolean;
  hometownText: string | null;
  occupationText: string | null;
  verificationStatus: VerificationStatusType;
  avatarPath?: string | null;
  version: number;
}

export interface RelatedPersonSummary {
  id: string;
  fullName: string;
  gender: GenderType;
  livingStatus: LivingStatusType;
  birthDate?: string | null;
  birthYear: number | null;
  birthDatePrecision?: DatePrecisionType;
  birthIsEstimated?: boolean;
  deathDate?: string | null;
  deathYear: number | null;
  deathDatePrecision?: DatePrecisionType;
  deathIsEstimated?: boolean;
}

export interface ParentRelationshipItem {
  id: string;
  parent: RelatedPersonSummary;
  parentRole: ParentRoleType;
  relationshipKind: RelationshipKindType;
  verificationStatus: VerificationStatusType;
}

export interface ChildRelationshipItem {
  id: string;
  child: RelatedPersonSummary;
  parentRole: ParentRoleType;
  relationshipKind: RelationshipKindType;
  verificationStatus: VerificationStatusType;
}

export interface SpouseRelationshipItem {
  id: string;
  unionId: string;
  spouse: RelatedPersonSummary;
  role: UnionMemberRoleType;
  unionStatus: Database["public"]["Enums"]["union_status_type"];
}

export interface SiblingRelationshipItem {
  id: string;
  sibling: RelatedPersonSummary;
  sharedType: "full" | "paternal" | "maternal" | "shared";
  sharedParents: Array<{
    id: string;
    fullName: string;
    role: ParentRoleType;
  }>;
}

export interface PersonRelationshipSummary {
  parents: ParentRelationshipItem[];
  children: ChildRelationshipItem[];
  spouses: SpouseRelationshipItem[];
  siblings: SiblingRelationshipItem[];
}

export interface PersonDetail extends Person {
  isOwner: boolean;
  canEdit: boolean;
  relationships: PersonRelationshipSummary;
}

export interface SimilarPersonCandidate {
  id: string;
  fullName: string;
  gender: GenderType;
  livingStatus: LivingStatusType;
  birthYear: number | null;
  deathYear: number | null;
  hometownText: string | null;
}

export interface PersonActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  warning?: {
    code: string;
    message: string;
    candidates: SimilarPersonCandidate[];
  };
}
