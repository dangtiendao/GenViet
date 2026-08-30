import { describe, it, expect } from "vitest";
import {
  familyTreeNameSchema,
  familyTreeDescriptionSchema,
  createFamilyTreeSchema,
  updateFamilyTreeBasicsSchema,
  updateFamilyTreePrivacySchema,
  setGenerationAnchorSchema,
  deleteFamilyTreeSchema,
  restoreFamilyTreeSchema,
} from "@/features/family-trees/schemas/family-tree.schema";

describe("Family Tree Validation Schemas (P11-T03 / AC-P11-022..028)", () => {
  describe("familyTreeNameSchema", () => {
    it("should accept valid Vietnamese names with accents", () => {
      const validNames = [
        "Gia phả Họ Nguyễn Đại Tộc",
        "Họ Đặng Chi 2 Xã Nam Thắng",
        "Dòng Họ Phan Bá",
        "Trần Tộc Phả Ký (1850)",
      ];

      validNames.forEach((name) => {
        const result = familyTreeNameSchema.safeParse(name);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(name);
        }
      });
    });

    it("should trim surrounding whitespace", () => {
      const result = familyTreeNameSchema.safeParse("   Họ Lê Cổ Am   ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Họ Lê Cổ Am");
      }
    });

    it("should reject empty or whitespace-only string", () => {
      const invalidNames = ["", "   ", "\t", " \n "];
      invalidNames.forEach((name) => {
        const result = familyTreeNameSchema.safeParse(name);
        expect(result.success).toBe(false);
      });
    });

    it("should reject names exceeding 100 characters", () => {
      const longName = "A".repeat(101);
      const result = familyTreeNameSchema.safeParse(longName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("100");
      }
    });

    it("should reject names containing control characters", () => {
      const nameWithControlChar = "Họ Nguyễn\x00Đại Tộc";
      const result = familyTreeNameSchema.safeParse(nameWithControlChar);
      expect(result.success).toBe(false);
    });

    it("should reject names containing newlines", () => {
      const nameWithNewline = "Họ Nguyễn\nĐại Tộc";
      const result = familyTreeNameSchema.safeParse(nameWithNewline);
      expect(result.success).toBe(false);
    });
  });

  describe("familyTreeDescriptionSchema", () => {
    it("should normalize empty string to null", () => {
      const result = familyTreeDescriptionSchema.safeParse("   ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it("should trim valid description", () => {
      const result = familyTreeDescriptionSchema.safeParse("   Mô tả dòng họ   ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Mô tả dòng họ");
      }
    });

    it("should reject description exceeding 1000 characters", () => {
      const longDesc = "A".repeat(1001);
      const result = familyTreeDescriptionSchema.safeParse(longDesc);
      expect(result.success).toBe(false);
    });
  });

  describe("createFamilyTreeSchema", () => {
    it("should validate and default privacy to private", () => {
      const result = createFamilyTreeSchema.safeParse({
        name: "Họ Vũ",
        description: "Gia phả Hải Dương",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.privacyLevel).toBe("private");
      }
    });
  });

  describe("updateFamilyTreeBasicsSchema & versioning", () => {
    it("should require positive integer expectedVersion for optimistic locking", () => {
      const valid = updateFamilyTreeBasicsSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        name: "Tên mới",
        expectedVersion: 2,
      });
      expect(valid.success).toBe(true);

      const invalidVersion = updateFamilyTreeBasicsSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        name: "Tên mới",
        expectedVersion: 0,
      });
      expect(invalidVersion.success).toBe(false);
    });
  });

  describe("setGenerationAnchorSchema", () => {
    it("should accept valid uuid or empty string normalized to null", () => {
      const withUuid = setGenerationAnchorSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        generationAnchorPersonId: "22222222-2222-2222-2222-222222222222",
        expectedVersion: 1,
      });
      expect(withUuid.success).toBe(true);

      const withEmpty = setGenerationAnchorSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        generationAnchorPersonId: "",
        expectedVersion: 1,
      });
      expect(withEmpty.success).toBe(true);
      if (withEmpty.success) {
        expect(withEmpty.data.generationAnchorPersonId).toBeNull();
      }
    });
  });

  describe("deleteFamilyTreeSchema", () => {
    it("should require confirmation name and valid treeId", () => {
      const valid = deleteFamilyTreeSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        confirmationName: "Cây Họ Nguyễn",
        expectedVersion: 1,
      });
      expect(valid.success).toBe(true);

      const invalid = deleteFamilyTreeSchema.safeParse({
        treeId: "11111111-1111-1111-1111-111111111111",
        confirmationName: "   ",
        expectedVersion: 1,
      });
      expect(invalid.success).toBe(false);
    });
  });
});
