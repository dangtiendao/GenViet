import { z } from "zod";
import { TreeRoleSchema } from "../roles/roles.types";

export const CreateInvitationSchema = z.object({
  treeId: z.string().uuid(),
  email: z.string().email().toLowerCase().trim(),
  role: TreeRoleSchema.refine((r) => r !== "owner", {
    message: "Cannot invite member directly as owner. Use ownership transfer.",
  }),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;

export const InvitationStatusSchema = z.enum([
  "pending",
  "accepted",
  "declined",
  "revoked",
  "expired",
]);

export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;
