import { z } from "zod";

export const TreeRoleSchema = z.enum(["owner", "admin", "editor", "contributor", "viewer"]);

export type TreeRole = z.infer<typeof TreeRoleSchema>;

export type TreePermission =
  | "tree:view"
  | "tree:edit_metadata"
  | "tree:delete"
  | "tree:transfer_ownership"
  | "person:view"
  | "person:create"
  | "person:edit"
  | "person:delete"
  | "relationship:manage"
  | "media:view"
  | "media:upload"
  | "media:delete"
  | "export:json"
  | "export:pdf"
  | "member:invite"
  | "member:manage_roles"
  | "proposal:create"
  | "proposal:review"
  | "person:merge";
