import { z } from "zod";

export const LinkStatusSchema = z.enum(["pending", "verified", "revoked"]);
export type LinkStatus = z.infer<typeof LinkStatusSchema>;

export interface AccountPersonLink {
  id: string;
  userId: string;
  personId: string;
  treeId: string;
  status: LinkStatus;
  linkedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export const CreateAccountLinkSchema = z.object({
  treeId: z.string().uuid(),
  personId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type CreateAccountLinkInput = z.infer<typeof CreateAccountLinkSchema>;
