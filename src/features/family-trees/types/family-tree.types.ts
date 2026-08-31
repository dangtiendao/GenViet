import type { Database } from "@/lib/supabase/database.types";

export type TreeStatus = Database["public"]["Enums"]["tree_status"];
export type TreePrivacyLevel = Database["public"]["Enums"]["tree_privacy_level"];
export type MembershipRole = Database["public"]["Enums"]["membership_role"];
export type MembershipStatus = Database["public"]["Enums"]["membership_status"];

export interface FamilyTreeListItem {
  id: string;
  name: string;
  description: string | null;
  status: TreeStatus;
  privacyLevel: TreePrivacyLevel;
  role: MembershipRole;
  createdAt: string;
  updatedAt: string;
  generationAnchorPersonId: string | null;
}

export interface FamilyTreeOverview {
  id: string;
  name: string;
  description: string | null;
  status: TreeStatus;
  privacyLevel: TreePrivacyLevel;
  role: MembershipRole;
  version: number;
  generationAnchorPersonId: string | null;
  generationAnchorPersonName: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  canEdit: boolean;
}

export interface FamilyTreeSettings {
  id: string;
  name: string;
  description: string | null;
  status: TreeStatus;
  privacyLevel: TreePrivacyLevel;
  version: number;
  generationAnchorPersonId: string | null;
  role: MembershipRole;
  publicSlug?: string | null;
  publishedAt?: string | null;
  publicationVersion?: number;
  livingPersonPolicy?: "REDACTED" | "STRICT";
  searchEngineVisibility?: "NOINDEX" | "INDEX";
}

export interface TreePersonOption {
  id: string;
  fullName: string;
  birthYear: number | null;
  deathYear: number | null;
  gender: string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}
