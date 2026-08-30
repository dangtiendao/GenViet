import { describe, it, expect } from "vitest";
import { mapLayoutToReactFlow } from "@/features/tree-view/layout/presentation-mapper";
import { calculateTargetCollapseIds } from "@/features/tree-view/hooks/use-tree-expansion";
import type { PositionedLayoutGraph } from "@/features/tree-view/layout/layout-graph.types";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

describe("Presentation Mapper Tests (P15-T06, P15-T17, P15-T18)", () => {
  const treeId = "t1111111-1111-4111-a111-111111111111";
  const centerId = "p2";

  const mockDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId: centerId,
    persons: [
      {
        id: "p1",
        fullName: "Nguyễn Văn A",
        gender: "male",
        livingStatus: "deceased",
        birthDate: null,
        birthYear: 1950,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: 2010,
        deathDatePrecision: "year",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
      {
        id: "p2",
        fullName: "Nguyễn Văn B",
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
      returnedPersonCount: 2,
      returnedRelationshipCount: 1,
      returnedUnionCount: 0,
      truncated: false,
    },
    truncated: false,
  };

  const mockPositionedGraph: PositionedLayoutGraph = {
    id: "layout-t1",
    width: 500,
    height: 300,
    nodes: [
      { id: "p1", type: "person", width: 220, height: 90, x: 100, y: 50 },
      { id: "p2", type: "person", width: 220, height: 90, x: 100, y: 220 },
    ],
    edges: [{ id: "e-pc-r1", type: "parent-child", source: "p1", target: "p2" }],
  };

  it("gán cờ isCenter và isSelected chính xác cho từng React Flow Node", () => {
    const { nodes, edges } = mapLayoutToReactFlow(mockPositionedGraph, mockDto, {
      treeId,
      selectedPersonId: "p1",
    });

    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);

    const nodeP1 = nodes.find((n) => n.id === "p1")!;
    const nodeP2 = nodes.find((n) => n.id === "p2")!;

    expect(nodeP1.data.isCenter).toBe(false);
    expect(nodeP1.data.isSelected).toBe(true);

    expect(nodeP2.data.isCenter).toBe(true);
    expect(nodeP2.data.isSelected).toBe(false);
  });

  it("đồng bộ thu gọn cả Chồng và Vợ khi thu gọn một người trong cặp phối ngẫu", () => {
    const dtoWithSpouses: TreeGraphDto = {
      ...mockDto,
      persons: [
        ...mockDto.persons,
        {
          id: "p1_wife",
          fullName: "Trần Thị C",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: 1955,
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
      unions: [
        {
          id: "u1",
          status: "active",
          startDate: null,
          startYear: null,
          startDatePrecision: "unknown",
          endDate: null,
          endYear: null,
          endDatePrecision: "unknown",
          verificationStatus: "verified",
        },
      ],
      unionMembers: [
        { unionId: "u1", personId: "p1", memberRole: "spouse" },
        { unionId: "u1", personId: "p1_wife", memberRole: "spouse" },
      ],
    };

    // Thu gọn từ Chồng (p1) => Trả về cả p1 và p1_wife
    const targetFromHusband = calculateTargetCollapseIds("p1", dtoWithSpouses);
    expect(targetFromHusband.has("p1")).toBe(true);
    expect(targetFromHusband.has("p1_wife")).toBe(true);
    expect(targetFromHusband.size).toBe(2);

    // Thu gọn từ Vợ (p1_wife) => Trả về cả p1 và p1_wife
    const targetFromWife = calculateTargetCollapseIds("p1_wife", dtoWithSpouses);
    expect(targetFromWife.has("p1")).toBe(true);
    expect(targetFromWife.has("p1_wife")).toBe(true);
    expect(targetFromWife.size).toBe(2);

    // Thu gọn người không có phối ngẫu (p2) => Chỉ trả về p2
    const targetSingle = calculateTargetCollapseIds("p2", dtoWithSpouses);
    expect(targetSingle.has("p2")).toBe(true);
    expect(targetSingle.size).toBe(1);
  });
});
