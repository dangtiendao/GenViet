import { describe, it, expect } from "vitest";
import { mergeTreeGraphDtos } from "@/features/tree-view/layout/graph-merge";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

describe("Graph Merge Tests (Cumulative Tree Expansion)", () => {
  const treeId = "test-tree";

  const baseDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId: "p1",
    persons: [
      {
        id: "p1",
        fullName: "Ông Bố",
        gender: "male",
        livingStatus: "living",
        birthDate: null,
        birthYear: 1960,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: true,
      },
      {
        id: "p2",
        fullName: "Con Cả",
        gender: "male",
        livingStatus: "living",
        birthDate: null,
        birthYear: 1985,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
    ],
    parentChildRelationships: [
      {
        id: "r1",
        parentId: "p1",
        childId: "p2",
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      },
    ],
    unions: [],
    unionMembers: [],
    expansion: {
      p2: {
        hasMoreAncestors: false,
        hasMoreDescendants: true,
        canAddFather: false,
        canAddMother: true,
        canExpandAncestors: false,
        canExpandDescendants: true,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: false,
      },
    },
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
      returnedPersonCount: 2,
      returnedRelationshipCount: 1,
      returnedUnionCount: 0,
      truncated: false,
    },
    truncated: false,
  };

  const incomingDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId: "p2",
    persons: [
      {
        id: "p2",
        fullName: "Con Cả",
        gender: "male",
        livingStatus: "living",
        birthDate: null,
        birthYear: 1985,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: true,
      },
      {
        id: "p3",
        fullName: "Cháu Gái",
        gender: "female",
        livingStatus: "living",
        birthDate: null,
        birthYear: 2015,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
    ],
    parentChildRelationships: [
      {
        id: "r2",
        parentId: "p2",
        childId: "p3",
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      },
    ],
    unions: [],
    unionMembers: [],
    expansion: {
      p3: {
        hasMoreAncestors: false,
        hasMoreDescendants: false,
        canAddFather: false,
        canAddMother: true,
        canExpandAncestors: false,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: false,
      },
    },
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
      returnedPersonCount: 2,
      returnedRelationshipCount: 1,
      returnedUnionCount: 0,
      truncated: false,
    },
    truncated: false,
  };

  it("hợp nhất 2 lát cắt: giữ nguyên các nhân vật cũ và thêm các nhân vật mới mà không mất cây", () => {
    const merged = mergeTreeGraphDtos(baseDto, incomingDto);

    // Có cả 3 nhân vật: p1 (Ông Bố), p2 (Con Cả), p3 (Cháu Gái)
    expect(merged.persons).toHaveLength(3);
    expect(merged.persons.map((p) => p.id)).toEqual(expect.arrayContaining(["p1", "p2", "p3"]));

    // Có cả 2 mối quan hệ cha-con: r1 (p1->p2) và r2 (p2->p3)
    expect(merged.parentChildRelationships).toHaveLength(2);
    expect(merged.parentChildRelationships.map((r) => r.id)).toEqual(["r1", "r2"]);

    // Metadata expansion của cả p2 và p3 đều tồn tại
    expect(merged.expansion.p2).toBeDefined();
    expect(merged.expansion.p3).toBeDefined();

    // CenterPersonId được cập nhật chính xác theo incoming center
    expect(merged.centerPersonId).toBe("p2");
    const p1 = merged.persons.find((p) => p.id === "p1");
    const p2 = merged.persons.find((p) => p.id === "p2");
    expect(p1?.isCenter).toBe(false);
    expect(p2?.isCenter).toBe(true);
  });
});
