import { describe, it, expect } from "vitest";
import {
  DESCENDANT_TRAVERSAL_MODES,
  DEFAULT_DESCENDANT_TRAVERSAL_MODE,
  TRUNCATION_REASONS,
} from "@/features/tree-graph/contracts/descendant-traversal-mode";
import { treeGraphQuerySchema } from "@/features/tree-graph/schemas/tree-graph-query.schema";

describe("Traversal Mode Contracts & Schema Tests (P28-T01 -> P28-T07)", () => {
  const validTreeId = "11111111-1111-4111-a111-111111111111";
  const validPersonId = "22222222-2222-4222-a222-222222222222";

  it("chứa đầy đủ các giá trị enum của Traversal Mode và Truncation Reasons", () => {
    expect(DESCENDANT_TRAVERSAL_MODES).toContain("PATERNAL_LINE");
    expect(DESCENDANT_TRAVERSAL_MODES).toContain("ALL_DESCENDANTS");
    expect(DEFAULT_DESCENDANT_TRAVERSAL_MODE).toBe("PATERNAL_LINE");

    expect(TRUNCATION_REASONS).toContain("PATERNAL_LINE");
    expect(TRUNCATION_REASONS).toContain("DEPTH_LIMIT");
    expect(TRUNCATION_REASONS).toContain("COLLAPSED");
    expect(TRUNCATION_REASONS).toContain("NOT_LOADED");
  });

  it("mặc định gán PATERNAL_LINE khi request không truyền descendantTraversalMode", () => {
    const parsed = treeGraphQuerySchema.parse({
      treeId: validTreeId,
      centerPersonId: validPersonId,
    });

    expect(parsed.descendantTraversalMode).toBe("PATERNAL_LINE");
  });

  it("chấp nhận ALL_DESCENDANTS khi request chỉ định rõ ràng", () => {
    const parsed = treeGraphQuerySchema.parse({
      treeId: validTreeId,
      centerPersonId: validPersonId,
      descendantTraversalMode: "ALL_DESCENDANTS",
    });

    expect(parsed.descendantTraversalMode).toBe("ALL_DESCENDANTS");
  });

  it("từ chối chế độ traversal không hợp lệ", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validPersonId,
      descendantTraversalMode: "INVALID_MODE",
    });

    expect(result.success).toBe(false);
  });

  it("chấp nhận branchBoundaryPersonId là UUID hợp lệ", () => {
    const boundaryId = "33333333-3333-4333-a333-333333333333";
    const parsed = treeGraphQuerySchema.parse({
      treeId: validTreeId,
      centerPersonId: validPersonId,
      branchBoundaryPersonId: boundaryId,
    });

    expect(parsed.branchBoundaryPersonId).toBe(boundaryId);
  });

  it("từ chối branchBoundaryPersonId nếu không phải UUID", () => {
    const result = treeGraphQuerySchema.safeParse({
      treeId: validTreeId,
      centerPersonId: validPersonId,
      branchBoundaryPersonId: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });
});
