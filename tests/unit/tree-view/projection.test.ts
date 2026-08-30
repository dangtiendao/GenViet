import { describe, it, expect } from "vitest";
import { projectDtoToLayoutGraph } from "@/features/tree-view/layout/graph-projection";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import { TREE_LAYOUT_CONFIG } from "@/features/tree-view/config/tree-layout.config";

describe("Tree View Graph Projection Tests (P15-T06, P15-T10, P15-T11, P15-T12)", () => {
  const treeId = "t1111111-1111-4111-a111-111111111111";
  const centerId = "p2222222-2222-4222-a222-222222222222";
  const fatherId = "p1111111-1111-4111-a111-111111111111";
  const childId = "p3333333-3333-4333-a333-333333333333";
  const spouse1Id = "p4444444-4444-4444-a444-444444444444";
  const spouse2Id = "p5555555-5555-4555-a555-555555555555";
  const union1Id = "u1111111-1111-4111-a111-111111111111";
  const union2Id = "u2222222-2222-4222-a222-222222222222";

  const mockMultiMarriageDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId: centerId,
    persons: [
      {
        id: fatherId,
        fullName: "Ông Bố",
        gender: "male",
        livingStatus: "deceased",
        birthDate: null,
        birthYear: 1950,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: 2020,
        deathDatePrecision: "year",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
      {
        id: centerId,
        fullName: "Người Con Trung Tâm",
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
      {
        id: childId,
        fullName: "Cháu Bé",
        gender: "female",
        livingStatus: "living",
        birthDate: null,
        birthYear: 2010,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
      {
        id: spouse1Id,
        fullName: "Vợ Thứ Nhất (Ly hôn)",
        gender: "female",
        livingStatus: "living",
        birthDate: null,
        birthYear: 1982,
        birthDatePrecision: "year",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        isCenter: false,
      },
      {
        id: spouse2Id,
        fullName: "Vợ Thứ Hai (Hiện tại)",
        gender: "female",
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
        parentId: fatherId,
        childId: centerId,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      },
      {
        id: "r2",
        parentId: centerId,
        childId: childId,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      },
    ],
    unions: [
      {
        id: union1Id,
        status: "divorced",
        startDate: null,
        startYear: 2004,
        startDatePrecision: "year",
        endDate: null,
        endYear: 2008,
        endDatePrecision: "year",
        verificationStatus: "verified",
      },
      {
        id: union2Id,
        status: "active",
        startDate: null,
        startYear: 2009,
        startDatePrecision: "year",
        endDate: null,
        endYear: null,
        endDatePrecision: "unknown",
        verificationStatus: "verified",
      },
    ],
    unionMembers: [
      { unionId: union1Id, personId: centerId, memberRole: "spouse" },
      { unionId: union1Id, personId: spouse1Id, memberRole: "spouse" },
      { unionId: union2Id, personId: centerId, memberRole: "spouse" },
      { unionId: union2Id, personId: spouse2Id, memberRole: "spouse" },
    ],
    expansion: {
      [centerId]: {
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
      returnedPersonCount: 5,
      returnedRelationshipCount: 2,
      returnedUnionCount: 2,
      truncated: false,
    },
    truncated: false,
  };

  it("chuyển đổi đầy đủ PersonNodes và UnionNodes với kích thước chuẩn", () => {
    const layoutGraph = projectDtoToLayoutGraph(mockMultiMarriageDto);

    // 5 persons + 2 unions = 7 layout nodes
    expect(layoutGraph.nodes).toHaveLength(7);

    const personNodes = layoutGraph.nodes.filter((n) => n.type === "person");
    const unionNodes = layoutGraph.nodes.filter((n) => n.type === "union");

    expect(personNodes).toHaveLength(5);
    expect(unionNodes).toHaveLength(2);

    expect(personNodes[0].width).toBe(TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH);
    expect(personNodes[0].height).toBe(TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT);
    expect(unionNodes[0].width).toBe(TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH);
    expect(unionNodes[0].height).toBe(TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT);
  });

  it("tạo đúng các cạnh quan hệ cha con và cạnh hôn phối (Parent-Child & Union-Member)", () => {
    const layoutGraph = projectDtoToLayoutGraph(mockMultiMarriageDto);

    // 2 parent-child edges + 4 union-member edges = 6 edges
    expect(layoutGraph.edges).toHaveLength(6);

    const pcEdges = layoutGraph.edges.filter((e) => e.type === "parent-child");
    const umEdges = layoutGraph.edges.filter((e) => e.type === "union-member");

    expect(pcEdges).toHaveLength(2);
    expect(umEdges).toHaveLength(4);
  });

  it("hỗ trợ trường hợp thiếu mẹ (chỉ có bố) mà không tạo node rác", () => {
    const layoutGraph = projectDtoToLayoutGraph(mockMultiMarriageDto);
    const centerNode = layoutGraph.nodes.find((n) => n.id === centerId);
    expect(centerNode).toBeDefined();

    // Chỉ có 1 cạnh nối fatherId -> centerId
    const fatherEdge = layoutGraph.edges.find(
      (e) => e.source === fatherId && e.target === centerId
    );
    expect(fatherEdge).toBeDefined();
  });

  it("tôn trọng trạng thái thu gọn nhánh (Branch Collapse) nhưng không bao giờ ẩn Center Person", () => {
    // Thu gọn nhánh của Center Person -> Ẩn childId
    const collapsed = new Set([centerId]);
    const layoutGraph = projectDtoToLayoutGraph(mockMultiMarriageDto, collapsed);

    // childId bị ẩn
    expect(layoutGraph.nodes.some((n) => n.id === childId)).toBe(false);
    // Center Person và Father vẫn hiển thị
    expect(layoutGraph.nodes.some((n) => n.id === centerId)).toBe(true);
    expect(layoutGraph.nodes.some((n) => n.id === fatherId)).toBe(true);
  });
});
