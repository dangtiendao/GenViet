import { describe, it, expect } from "vitest";
import {
  addNewParentSchema,
  linkExistingParentSchema,
  addNewChildSchema,
  linkExistingChildSchema,
  createUnionWithNewPersonSchema,
  createUnionWithExistingPersonSchema,
  endUnionSchema,
  softDeleteRelationshipSchema,
  replaceParentRelationshipSchema,
} from "@/features/relationships/schemas/relationship.schema";

describe("Relationship Zod Validation Schemas", () => {
  const treeId = "11111111-1111-1111-1111-111111111111";
  const personId1 = "22222222-2222-2222-2222-222222222222";
  const personId2 = "33333333-3333-3333-3333-333333333333";
  const relId = "44444444-4444-4444-4444-444444444444";
  const unionId = "55555555-5555-5555-5555-555555555555";

  describe("addNewParentSchema", () => {
    it("chấp nhận input hợp lệ khi tạo cha mới", () => {
      const parsed = addNewParentSchema.safeParse({
        treeId,
        childId: personId1,
        fullName: "Trần Văn Cha",
        gender: "male",
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      });
      expect(parsed.success).toBe(true);
    });

    it("từ chối khi tên cha để trống", () => {
      const parsed = addNewParentSchema.safeParse({
        treeId,
        childId: personId1,
        fullName: "   ",
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe("linkExistingParentSchema", () => {
    it("chấp nhận liên kết cha mẹ hợp lệ", () => {
      const parsed = linkExistingParentSchema.safeParse({
        treeId,
        parentId: personId1,
        childId: personId2,
        parentRole: "father",
      });
      expect(parsed.success).toBe(true);
    });

    it("từ chối self-parent (parent_id === child_id)", () => {
      const parsed = linkExistingParentSchema.safeParse({
        treeId,
        parentId: personId1,
        childId: personId1,
        parentRole: "father",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0].message).toContain("tự làm cha/mẹ của chính mình");
      }
    });
  });

  describe("addNewChildSchema", () => {
    it("chấp nhận input tạo con mới", () => {
      const parsed = addNewChildSchema.safeParse({
        treeId,
        parentId: personId1,
        fullName: "Trần Thị Con",
        gender: "female",
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe("linkExistingChildSchema", () => {
    it("từ chối self-child (parent_id === child_id)", () => {
      const parsed = linkExistingChildSchema.safeParse({
        treeId,
        parentId: personId1,
        childId: personId1,
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe("createUnionWithExistingPersonSchema", () => {
    it("chấp nhận kết đôi 2 người khác nhau", () => {
      const parsed = createUnionWithExistingPersonSchema.safeParse({
        treeId,
        person1Id: personId1,
        person2Id: personId2,
      });
      expect(parsed.success).toBe(true);
    });

    it("từ chối self-spouse (person1_id === person2_id)", () => {
      const parsed = createUnionWithExistingPersonSchema.safeParse({
        treeId,
        person1Id: personId1,
        person2Id: personId1,
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0].message).toContain("tự kết hôn với chính mình");
      }
    });
  });

  describe("endUnionSchema", () => {
    it("chấp nhận trạng thái kết thúc hợp lệ (divorced, widowed)", () => {
      const parsed = endUnionSchema.safeParse({
        unionId,
        expectedVersion: 1,
        newStatus: "divorced",
      });
      expect(parsed.success).toBe(true);
    });

    it("từ chối nếu trạng thái mới là active", () => {
      const parsed = endUnionSchema.safeParse({
        unionId,
        expectedVersion: 1,
        newStatus: "active",
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe("replaceParentRelationshipSchema", () => {
    it("chấp nhận input thay thế quan hệ hợp lệ", () => {
      const parsed = replaceParentRelationshipSchema.safeParse({
        treeId,
        oldRelationshipId: relId,
        oldExpectedVersion: 1,
        newParentId: personId1,
        childId: personId2,
      });
      expect(parsed.success).toBe(true);
    });

    it("từ chối nếu new_parent_id === child_id", () => {
      const parsed = replaceParentRelationshipSchema.safeParse({
        treeId,
        oldRelationshipId: relId,
        oldExpectedVersion: 1,
        newParentId: personId1,
        childId: personId1,
      });
      expect(parsed.success).toBe(false);
    });
  });
});
