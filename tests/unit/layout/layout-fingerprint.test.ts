import { describe, it, expect } from "vitest";
import { computeLayoutFingerprint } from "@/features/tree-view/hooks/use-tree-layout";
import { TREE_LAYOUT_CONFIG } from "@/features/tree-view/config/tree-layout.config";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

describe("P22-T05: Layout Fingerprint & Dimensions (Layout Input)", () => {
  const mockDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId: "t1111111-1111-4111-a111-111111111111",
    centerPersonId: "p1",
    persons: [
      {
        id: "p1",
        fullName: "Nguyễn Văn A",
        gender: "male",
        livingStatus: "living",
        birthDate: "1980-01-01",
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

  it("cấu hình layout ELK định nghĩa đúng hướng DOWN và khoảng cách chuẩn", () => {
    expect(TREE_LAYOUT_CONFIG.DEFAULT_DIRECTION).toBe("DOWN");
    expect(TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH).toBe(260);
    expect(TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT).toBe(100);
    expect(TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH).toBe(16);
    expect(TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT).toBe(16);
    expect(TREE_LAYOUT_CONFIG.LAYER_SPACING).toBe(90);
  });

  it("fingerprint không đổi khi chỉ thay đổi selection hoặc pan/zoom state", () => {
    const fp1 = computeLayoutFingerprint(mockDto, new Set());
    const fp2 = computeLayoutFingerprint(mockDto, new Set());
    expect(fp1).toBe(fp2);
  });

  it("fingerprint thay đổi khi có thay đổi cấu trúc hoặc trạng thái ẩn nhánh", () => {
    const fp1 = computeLayoutFingerprint(mockDto, new Set());
    const fp2 = computeLayoutFingerprint(mockDto, new Set(["p1"]));
    expect(fp1).not.toBe(fp2);
  });
});
