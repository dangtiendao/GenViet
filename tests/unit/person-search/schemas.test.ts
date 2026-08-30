import { describe, it, expect } from "vitest";
import { personSearchQuerySchema } from "@/features/person-search/schemas/person-search.schema";

describe("Person Search Zod Schema Tests (P16-T07, P16-T10, P16-T11, P16-T12)", () => {
  const validTreeId = "11111111-1111-4111-a111-111111111111";

  it("chấp nhận input hợp lệ với đầy đủ tham số", () => {
    const res = personSearchQuerySchema.safeParse({
      treeId: validTreeId,
      query: "Nguyen Van A",
      birthYear: 1980,
      livingStatus: "living",
      missingInformation: "none",
      limit: 20,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.treeId).toBe(validTreeId);
      expect(res.data.query).toBe("Nguyen Van A");
      expect(res.data.birthYear).toBe(1980);
      expect(res.data.livingStatus).toBe("living");
      expect(res.data.limit).toBe(20);
    }
  });

  it("gán giá trị mặc định cho các trường tùy chọn", () => {
    const res = personSearchQuerySchema.safeParse({
      treeId: validTreeId,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.query).toBe("");
      expect(res.data.livingStatus).toBe("all");
      expect(res.data.missingInformation).toBe("none");
      expect(res.data.limit).toBe(20);
    }
  });

  it("từ chối treeId không phải UUID hợp lệ", () => {
    const res = personSearchQuerySchema.safeParse({
      treeId: "invalid-uuid",
    });

    expect(res.success).toBe(false);
  });

  it("từ chối năm sinh vượt ngoài phạm vi 100 - 2500", () => {
    const resUnder = personSearchQuerySchema.safeParse({
      treeId: validTreeId,
      birthYear: 50,
    });
    expect(resUnder.success).toBe(false);

    const resOver = personSearchQuerySchema.safeParse({
      treeId: validTreeId,
      birthYear: 3000,
    });
    expect(resOver.success).toBe(false);
  });

  it("từ chối limit vượt quá MAX_LIMIT (50)", () => {
    const res = personSearchQuerySchema.safeParse({
      treeId: validTreeId,
      limit: 100,
    });

    expect(res.success).toBe(false);
  });
});
