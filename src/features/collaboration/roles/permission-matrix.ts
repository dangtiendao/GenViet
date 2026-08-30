import { TreeRole, TreePermission } from "./roles.types";

export const ROLE_PERMISSIONS: Record<TreeRole, Set<TreePermission>> = {
  owner: new Set<TreePermission>([
    "tree:view",
    "tree:edit_metadata",
    "tree:delete",
    "tree:transfer_ownership",
    "person:view",
    "person:create",
    "person:edit",
    "person:delete",
    "relationship:manage",
    "media:view",
    "media:upload",
    "media:delete",
    "export:json",
    "export:pdf",
    "member:invite",
    "member:manage_roles",
    "proposal:create",
    "proposal:review",
    "person:merge",
  ]),
  admin: new Set<TreePermission>([
    "tree:view",
    "tree:edit_metadata",
    "person:view",
    "person:create",
    "person:edit",
    "person:delete",
    "relationship:manage",
    "media:view",
    "media:upload",
    "media:delete",
    "export:json",
    "export:pdf",
    "member:invite",
    "member:manage_roles",
    "proposal:create",
    "proposal:review",
    "person:merge",
  ]),
  editor: new Set<TreePermission>([
    "tree:view",
    "person:view",
    "person:create",
    "person:edit",
    "relationship:manage",
    "media:view",
    "media:upload",
    "export:json",
    "export:pdf",
    "proposal:create",
  ]),
  contributor: new Set<TreePermission>([
    "tree:view",
    "person:view",
    "media:view",
    "export:pdf",
    "proposal:create",
  ]),
  viewer: new Set<TreePermission>(["tree:view", "person:view", "media:view", "export:pdf"]),
};

export function hasPermission(role: TreeRole, permission: TreePermission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.has(permission);
}

export function canManageRole(actorRole: TreeRole, targetRole: TreeRole): boolean {
  if (actorRole === "owner") return true;
  if (actorRole === "admin") {
    // Admin không được gán quyền Owner hoặc hạ quyền Owner
    return targetRole !== "owner";
  }
  return false;
}
