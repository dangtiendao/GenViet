import { z } from "zod";

export const ProposalStatusSchema = z.enum([
  "draft",
  "submitted",
  "approved",
  "rejected",
  "withdrawn",
  "superseded",
  "applied",
]);

export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;

export const ProposalTargetTypeSchema = z.enum([
  "person",
  "event",
  "relationship",
  "media_metadata",
]);

export type ProposalTargetType = z.infer<typeof ProposalTargetTypeSchema>;

export interface FieldDiff {
  fieldName: string;
  oldValue: any;
  newValue: any;
}

export interface ProposalPayload {
  id: string;
  treeId: string;
  targetType: ProposalTargetType;
  targetId: string;
  baseVersion: number;
  authorId: string;
  status: ProposalStatus;
  diffs: FieldDiff[];
  reason?: string;
  reviewComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
