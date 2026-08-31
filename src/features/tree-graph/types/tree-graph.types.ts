import type { Database } from "@/lib/supabase/database.types";

export type Gender = Database["public"]["Enums"]["gender_type"];
export type LivingStatus = Database["public"]["Enums"]["living_status_type"];
export type DatePrecision = Database["public"]["Enums"]["date_precision_type"];
export type VerificationStatus = Database["public"]["Enums"]["verification_status_type"];
export type ParentRole = Database["public"]["Enums"]["parent_role_type"];
export type RelationshipKind = Database["public"]["Enums"]["relationship_kind_type"];
export type UnionStatus = Database["public"]["Enums"]["union_status_type"];
export type UnionMemberRole = Database["public"]["Enums"]["union_member_role_type"];

export interface PartialDateSummary {
  date: string | null;
  year: number | null;
  precision: DatePrecision;
  isEstimated: boolean;
  displayFormatted?: string;
}

/**
 * DTO đại diện cho một Person Node trên đồ thị (Lớp 2: Query Graph Slice).
 * Tuyệt đối không chứa tọa độ không gian (x, y) hay kiểu dữ liệu React Flow.
 */
export interface GraphPersonDto {
  id: string;
  fullName: string;
  gender: Gender;
  livingStatus: LivingStatus;
  birthDate: string | null;
  birthYear: number | null;
  birthDatePrecision: DatePrecision;
  birthIsEstimated: boolean;
  deathDate: string | null;
  deathYear: number | null;
  deathDatePrecision: DatePrecision;
  deathIsEstimated: boolean;
  verificationStatus: VerificationStatus;
  avatarPath?: string | null;
  isCenter: boolean;
  isGenerationAnchor?: boolean;
}

/**
 * DTO đại diện cho cạnh huyết thống Cha/Mẹ -> Con.
 */
export interface ParentChildRelationshipDto {
  id: string;
  parentId: string;
  childId: string;
  parentRole: ParentRole;
  relationshipKind: RelationshipKind;
  verificationStatus: VerificationStatus;
}

/**
 * DTO đại diện cho thực thể Hôn nhân / Kết đôi (Union).
 */
export interface UnionDto {
  id: string;
  status: UnionStatus;
  startDate: string | null;
  startYear: number | null;
  startDatePrecision: DatePrecision;
  endDate: string | null;
  endYear: number | null;
  endDatePrecision: DatePrecision;
  verificationStatus: VerificationStatus;
}

/**
 * DTO thành viên tham gia Union.
 */
export interface UnionMemberDto {
  unionId: string;
  personId: string;
  memberRole: UnionMemberRole;
}

import type {
  DescendantTraversalMode,
  TruncationReason,
} from "../contracts/descendant-traversal-mode";

export type { DescendantTraversalMode, TruncationReason };

/**
 * Metadata mở rộng đồ thị cho từng Person trong slice.
 */
export interface ExpansionDto {
  hasMoreAncestors: boolean;
  hasMoreDescendants: boolean;
  canAddFather: boolean;
  canAddMother: boolean;
  canExpandAncestors: boolean;
  canExpandDescendants: boolean;
  hasVerifiedBiologicalFather: boolean;
  hasVerifiedBiologicalMother: boolean;
  hasHiddenDescendants?: boolean;
  descendantsTruncated?: boolean;
  truncationReason?: TruncationReason | null;
}

/**
 * Metadata giới hạn và ngân sách đồ thị.
 */
export interface LimitsDto {
  requestedAncestorDepth: number;
  requestedDescendantDepth: number;
  appliedAncestorDepth: number;
  appliedDescendantDepth: number;
  maxAncestorDepth: number;
  maxDescendantDepth: number;
  maxPersonsBudget: number;
  maxRelationshipsBudget: number;
  maxUnionsBudget: number;
  returnedPersonCount: number;
  returnedRelationshipCount: number;
  returnedUnionCount: number;
  truncated: boolean;
  truncatedReason?: string | null;
}

/**
 * DTO tổng thể toàn bộ vùng cây gia phả trả về cho client / Phase P15.
 */
export interface TreeGraphDto {
  schemaVersion: number;
  treeId: string;
  centerPersonId: string;
  descendantTraversalMode?: DescendantTraversalMode;
  persons: GraphPersonDto[];
  parentChildRelationships: ParentChildRelationshipDto[];
  unions: UnionDto[];
  unionMembers: UnionMemberDto[];
  expansion: Record<string, ExpansionDto>;
  limits: LimitsDto;
  truncated: boolean;
  warnings?: string[];
}
