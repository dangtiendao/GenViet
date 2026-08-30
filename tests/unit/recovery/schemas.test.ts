import { describe, it, expect } from "vitest";
import {
  restorePersonSchema,
  restoreRelationshipSchema,
  restoreUnionSchema,
} from "@/features/recovery/schemas/restore.schema";

describe("Recovery Schemas Validation", () => {
  const treeId = "11111111-1111-4111-a111-111111111111";
  const personId = "22222222-2222-4222-a222-222222222222";
  const relId = "33333333-3333-4333-a333-333333333333";
  const unionId = "44444444-4444-4444-a444-444444444444";

  it("chấp nhận input restorePersonSchema hợp lệ", () => {
    const res = restorePersonSchema.safeParse({
      treeId,
      personId,
      expectedVersion: 2,
      confirmWarnings: true,
    });
    expect(res.success).toBe(true);
  });

  it("chấp nhận input restoreRelationshipSchema hợp lệ", () => {
    const res = restoreRelationshipSchema.safeParse({
      treeId,
      relationshipId: relId,
    });
    expect(res.success).toBe(true);
  });

  it("chấp nhận input restoreUnionSchema hợp lệ", () => {
    const res = restoreUnionSchema.safeParse({
      treeId,
      unionId,
      expectedVersion: 1,
    });
    expect(res.success).toBe(true);
  });

  it("từ chối khi truyền UUID không hợp lệ", () => {
    const res = restorePersonSchema.safeParse({
      treeId: "not-a-uuid",
      personId,
    });
    expect(res.success).toBe(false);
  });
});
