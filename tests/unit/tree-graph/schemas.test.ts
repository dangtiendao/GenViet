import { describe, it, expect } from "vitest";
import {
  treeGraphQuerySchema,
  TREE_GRAPH_LIMITS,
} from "@/features/tree-graph/schemas/tree-graph-query.schema";

describe("TreeGraphQuerySchema Validation Tests (P14-T02, P14-T13)", () => {
  const validTreeId = "11111111-1111-1111-1111-111111111111";
  const validCenterId = "22222222-2222-2222-2222-222222222222";

  it("chấp nhận input hợp lệ với các giá trị mặc định", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.treeId).toBe(validTreeId);
      expect(result.data.centerPersonId).toBe(validCenterId);
      expect(result.data.ancestorDepth).toBe(TREE_GRAPH_LIMITS.DEFAULT_ANCESTOR_DEPTH);
      expect(result.data.descendantDepth).toBe(TREE_GRAPH_LIMITS.DEFAULT_DESCENDANT_DEPTH);
      expect(result.data.includeSpouses).toBe(true);
      expect(result.data.includeUnverified).toBe(true);
    }
  });

  it("chấp nhận độ sâu tùy biến trong giới hạn cho phép (0 đến 5)", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
      ancestorDepth: 5,
      descendantDepth: 0,
      includeSpouses: false,
      includeUnverified: false,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ancestorDepth).toBe(5);
      expect(result.data.descendantDepth).toBe(0);
      expect(result.data.includeSpouses).toBe(false);
      expect(result.data.includeUnverified).toBe(false);
    }
  });

  it("từ chối khi treeId không đúng định dạng UUID", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: "not-a-valid-uuid",
      centerPersonId: validCenterId,
    });

    expect(result.success).toBe(false);
  });

  it("từ chối khi centerPersonId không đúng định dạng UUID", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("từ chối khi độ sâu là số âm", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
      ancestorDepth: -1,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("không thể âm");
    }
  });

  it("từ chối khi độ sâu vượt quá mức tối đa (max = 5)", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
      ancestorDepth: 6,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("tối đa là 5");
    }
  });

  it("từ chối khi độ sâu là số thập phân", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
      ancestorDepth: 2.5,
    });

    expect(result.success).toBe(false);
  });

  it("chế độ strict mode từ chối các trường không xác định hoặc cố tình bypass", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validCenterId,
      bypassRLS: true,
      role: "admin",
    });

    expect(result.success).toBe(false);
  });
});
