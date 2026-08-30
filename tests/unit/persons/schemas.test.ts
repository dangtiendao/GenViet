import { describe, it, expect } from "vitest";
import {
  personNameSchema,
  minimalCreatePersonSchema,
  createPersonSchema,
  updatePersonSchema,
  softDeletePersonSchema,
  restorePersonSchema,
} from "@/features/persons/schemas/person.schema";

describe("Person Validation Schemas (P12)", () => {
  describe("personNameSchema", () => {
    it("should accept valid Vietnamese full names with accents", () => {
      const validNames = [
        "Nguyễn Văn An",
        "Trần Thị Mỹ Duyên",
        "Đặng Tiến Đạo",
        "Vũ Hoàng Đức",
        "Lê Đức Thọ",
      ];
      for (const name of validNames) {
        const result = personNameSchema.safeParse(name);
        expect(result.success).toBe(true);
      }
    });

    it("should trim surrounding whitespace automatically", () => {
      const result = personNameSchema.safeParse("   Nguyễn Văn An   ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Nguyễn Văn An");
      }
    });

    it("should reject empty or whitespace-only name", () => {
      expect(personNameSchema.safeParse("").success).toBe(false);
      expect(personNameSchema.safeParse("   ").success).toBe(false);
    });

    it("should reject names with control characters or newlines", () => {
      expect(personNameSchema.safeParse("Nguyễn\nAn").success).toBe(false);
      expect(personNameSchema.safeParse("Nguyễn\rAn").success).toBe(false);
      expect(personNameSchema.safeParse("Nguyễn\x00An").success).toBe(false);
    });

    it("should reject names exceeding 100 characters", () => {
      const longName = "A".repeat(101);
      expect(personNameSchema.safeParse(longName).success).toBe(false);
    });
  });

  describe("createPersonSchema & Cross-Field Date Validation", () => {
    const validTreeId = "11111111-1111-4111-a111-111111111111";

    it("should accept a minimal valid person input", () => {
      const result = minimalCreatePersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Nguyễn Văn An",
        gender: "male",
        livingStatus: "living",
        birthPrecision: "unknown",
      });
      expect(result.success).toBe(true);
    });

    it("should accept year-only birth date without fake 01/01 date", () => {
      const result = createPersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Cụ Tổ Họ Nguyễn",
        gender: "male",
        livingStatus: "deceased",
        birthPrecision: "year",
        birthYear: 1850,
        birthDate: null,
        birthIsEstimated: false,
        deathPrecision: "year",
        deathYear: 1920,
        deathDate: null,
        deathIsEstimated: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject exact death date before exact birth date (AC-P12-075)", () => {
      const result = createPersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Nguyễn Văn B",
        gender: "male",
        livingStatus: "deceased",
        birthPrecision: "exact",
        birthDate: "1990-05-15",
        deathPrecision: "exact",
        deathDate: "1985-01-10", // Trước ngày sinh!
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain(
          "Ngày mất không thể diễn ra trước ngày sinh"
        );
      }
    });

    it("should reject year death before year birth when not estimated (AC-P12-076)", () => {
      const result = createPersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Nguyễn Văn C",
        gender: "male",
        livingStatus: "deceased",
        birthPrecision: "year",
        birthYear: 1950,
        birthIsEstimated: false,
        deathPrecision: "year",
        deathYear: 1940, // Trước năm sinh!
        deathIsEstimated: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain(
          "Năm mất không thể diễn ra trước năm sinh"
        );
      }
    });

    it("should allow year death before year birth if birth or death is marked estimated", () => {
      const result = createPersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Cụ Chưa Rõ Năm",
        gender: "unknown",
        livingStatus: "deceased",
        birthPrecision: "year",
        birthYear: 1950,
        birthIsEstimated: true, // Ước tính
        deathPrecision: "year",
        deathYear: 1948,
        deathIsEstimated: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject living status with exact death date", () => {
      const result = createPersonSchema.safeParse({
        treeId: validTreeId,
        fullName: "Nguyễn Văn D",
        gender: "male",
        livingStatus: "living",
        deathPrecision: "exact",
        deathDate: "2020-01-01",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("Còn sống");
      }
    });
  });

  describe("updatePersonSchema", () => {
    it("should require expectedVersion for optimistic locking", () => {
      const result = updatePersonSchema.safeParse({
        treeId: "11111111-1111-4111-a111-111111111111",
        personId: "22222222-2222-4222-a222-222222222222",
        expectedVersion: 1,
        fullName: "Nguyễn Văn An Cập Nhật",
        gender: "male",
        livingStatus: "living",
        birthPrecision: "unknown",
      });
      expect(result.success).toBe(true);
    });

    it("should reject non-positive expectedVersion", () => {
      const result = updatePersonSchema.safeParse({
        treeId: "11111111-1111-4111-a111-111111111111",
        personId: "22222222-2222-4222-a222-222222222222",
        expectedVersion: 0,
        fullName: "Nguyễn Văn An",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("softDeletePersonSchema & restorePersonSchema", () => {
    it("should validate soft delete input correctly", () => {
      const result = softDeletePersonSchema.safeParse({
        treeId: "11111111-1111-4111-a111-111111111111",
        personId: "22222222-2222-4222-a222-222222222222",
        expectedVersion: 3,
      });
      expect(result.success).toBe(true);
    });

    it("should validate restore input correctly", () => {
      const result = restorePersonSchema.safeParse({
        treeId: "11111111-1111-4111-a111-111111111111",
        personId: "22222222-2222-4222-a222-222222222222",
        expectedVersion: 4,
      });
      expect(result.success).toBe(true);
    });
  });
});
