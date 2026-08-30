import { describe, it, expect } from "vitest";
import {
  linkExistingParentSchema,
  createUnionWithExistingPersonSchema,
} from "@/features/relationships/schemas/relationship.schema";

describe("P22-T03: Kiểm thử xác thực quan hệ (Relationship Validation)", () => {
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const personA = "11111111-1111-4111-a111-111111111111";
  const personB = "22222222-2222-4222-a222-222222222222";

  it("từ chối quan hệ cha-con khi parent_id trùng với child_id (self-parent)", () => {
    const res = linkExistingParentSchema.safeParse({
      treeId,
      parentId: personA,
      childId: personA,
      parentRole: "father",
      relationshipKind: "biological",
    });

    expect(res.success).toBe(false);
  });

  it("chấp nhận quan hệ cha-con hợp lệ với vai trò và loại quan hệ chuẩn", () => {
    const res = linkExistingParentSchema.safeParse({
      treeId,
      parentId: personA,
      childId: personB,
      parentRole: "father",
      relationshipKind: "biological",
      verificationStatus: "verified",
    });

    expect(res.success).toBe(true);
  });

  it("từ chối quan hệ vợ chồng khi hai người trùng ID (self-spouse)", () => {
    const res = createUnionWithExistingPersonSchema.safeParse({
      treeId,
      person1Id: personA,
      person2Id: personA,
      unionStatus: "active",
    });

    expect(res.success).toBe(false);
  });

  it("chấp nhận quan hệ hôn nhân vợ chồng hợp lệ", () => {
    const res = createUnionWithExistingPersonSchema.safeParse({
      treeId,
      person1Id: personA,
      person2Id: personB,
      unionStatus: "active",
      startDate: "2015-06-20",
      startDatePrecision: "exact",
    });

    expect(res.success).toBe(true);
  });
});
