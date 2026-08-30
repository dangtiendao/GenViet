import { z } from "zod";

export const restorePersonSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  personId: z.string().uuid("Person ID không hợp lệ"),
  expectedVersion: z.number().int().positive().optional(),
  confirmWarnings: z.boolean().default(false),
});

export const restoreRelationshipSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  relationshipId: z.string().uuid("Relationship ID không hợp lệ"),
  expectedVersion: z.number().int().positive().optional(),
  confirmWarnings: z.boolean().default(false),
});

export const restoreUnionSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  unionId: z.string().uuid("Union ID không hợp lệ"),
  expectedVersion: z.number().int().positive().optional(),
  confirmWarnings: z.boolean().default(false),
});
