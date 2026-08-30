import { describe, it, expect } from "vitest";
import { auditQuerySchema } from "@/features/audit/schemas/audit-query.schema";

describe("Audit Query Schema Validation", () => {
  const validTreeId = "11111111-1111-4111-a111-111111111111";

  it("chấp nhận query hợp lệ với đầy đủ bộ lọc", () => {
    const input = {
      treeId: validTreeId,
      entityType: "person",
      actionType: "create",
      dateFrom: "2026-08-01",
      dateTo: "2026-08-30",
      limit: 25,
    };

    const res = auditQuerySchema.safeParse(input);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.limit).toBe(25);
    }
  });

  it("từ chối khi dateFrom lớn hơn dateTo", () => {
    const input = {
      treeId: validTreeId,
      dateFrom: "2026-08-30",
      dateTo: "2026-08-01",
    };

    const res = auditQuerySchema.safeParse(input);
    expect(res.success).toBe(false);
  });

  it("từ chối Entity Type không nằm trong danh mục", () => {
    const input = {
      treeId: validTreeId,
      entityType: "invalid_type_custom",
    };

    const res = auditQuerySchema.safeParse(input);
    expect(res.success).toBe(false);
  });
});
