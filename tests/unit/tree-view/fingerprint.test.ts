import { describe, it, expect } from "vitest";
import { computeLayoutFingerprint } from "@/features/tree-view/hooks/use-tree-layout";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

describe("Layout Fingerprint & No-Relayout Tests (P15-T27)", () => {
  const treeId = "t1111111-1111-4111-a111-111111111111";

  const mockDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId: "p1",
    persons: [
      {
        id: "p1",
        fullName: "Nguyễn Văn A",
        gender: "male",
        livingStatus: "living",
        birthDate: null,
        birthYear: 1980,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: true,
      },
    ],
    parentChildRelationships: [],
    unions: [],
    unionMembers: [],
    expansion: {},
    limits: {
      requestedAncestorDepth: 2,
      requestedDescendantDepth: 2,
      appliedAncestorDepth: 2,
      appliedDescendantDepth: 2,
      maxAncestorDepth: 5,
      maxDescendantDepth: 5,
      maxPersonsBudget: 250,
      maxRelationshipsBudget: 500,
      maxUnionsBudget: 150,
      returnedPersonCount: 1,
      returnedRelationshipCount: 0,
      returnedUnionCount: 0,
      truncated: false,
    },
    truncated: false,
  };

  it("sinh fingerprint giống nhau khi cấu trúc đồ thị không đổi", () => {
    const fp1 = computeLayoutFingerprint(mockDto, new Set());
    const fp2 = computeLayoutFingerprint(mockDto, new Set());

    expect(fp1).toBe(fp2);
    expect(fp1).toContain("P:p1");
  });

  it("thay đổi fingerprint khi có thêm nhân vật hoặc thu gọn nhánh", () => {
    const fpOriginal = computeLayoutFingerprint(mockDto, new Set());
    const fpCollapsed = computeLayoutFingerprint(mockDto, new Set(["p1"]));

    expect(fpOriginal).not.toBe(fpCollapsed);
  });
});
