import { z } from "zod";

const auditEntityEnum = z.enum([
  "family_tree",
  "person",
  "parent_child_relationship",
  "union",
  "union_member",
  "person_avatar",
]);

const auditActionEnum = z.enum([
  "create",
  "update",
  "soft_delete",
  "restore",
  "replace",
  "status_change",
  "link",
  "unlink",
  "privacy_change",
  "generation_anchor_change",
  "avatar_replace",
  "avatar_remove",
]);

export const auditQuerySchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    entityType: auditEntityEnum.optional(),
    actionType: auditActionEnum.optional(),
    actorUserId: z.string().uuid().optional(),
    dateFrom: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày bắt đầu không hợp lệ (YYYY-MM-DD)")
      .optional(),
    dateTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày kết thúc không hợp lệ (YYYY-MM-DD)")
      .optional(),
    entityId: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    cursor: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateFrom <= data.dateTo;
      }
      return true;
    },
    {
      message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc",
      path: ["dateFrom"],
    }
  );

export type AuditQueryInput = z.infer<typeof auditQuerySchema>;
