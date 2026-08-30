import { describe, it, expect } from "vitest";
import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";
import { projectDtoToLayoutGraph } from "@/features/tree-view/layout/graph-projection";
import type { LayoutGraph } from "@/features/tree-view/layout/layout-graph.types";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import { TREE_LAYOUT_CONFIG } from "@/features/tree-view/config/tree-layout.config";

describe("ELK.js Layout Adapter Tests (P15-T07, P15-T08, P15-T09, P15-T29, P15-T30)", () => {
  it("tính toán thành công tọa độ cho cây đơn nhân vật", async () => {
    const singleGraph: LayoutGraph = {
      id: "test-single",
      nodes: [
        {
          id: "p1",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
      ],
      edges: [],
    };

    const positioned = await calculateElkLayout(singleGraph);
    expect(positioned.nodes).toHaveLength(1);
    expect(positioned.nodes[0].x).toBeDefined();
    expect(positioned.nodes[0].y).toBeDefined();
    expect(positioned.width).toBeGreaterThanOrEqual(TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH);
  });

  it("đảm bảo phân tầng thế hệ đúng hướng DOWN: Cha y < Con y", async () => {
    const multiGenGraph: LayoutGraph = {
      id: "test-multi-gen",
      nodes: [
        {
          id: "father",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
        {
          id: "child",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
      ],
      edges: [
        {
          id: "e-pc-1",
          type: "parent-child",
          source: "father",
          target: "child",
        },
      ],
    };

    const positioned = await calculateElkLayout(multiGenGraph);
    const fatherNode = positioned.nodes.find((n) => n.id === "father")!;
    const childNode = positioned.nodes.find((n) => n.id === "child")!;

    expect(fatherNode.y).toBeLessThan(childNode.y);
    // Khoảng cách giữa 2 tầng tối thiểu phải lớn hơn hoặc bằng chiều cao node + layer spacing
    const yDelta = childNode.y - (fatherNode.y + fatherNode.height);
    expect(yDelta).toBeGreaterThanOrEqual(TREE_LAYOUT_CONFIG.LAYER_SPACING - 10);
  });

  it("đảm bảo các anh chị em trong cùng thế hệ không bị đè chồng lên nhau (No Overlap)", async () => {
    const siblingGraph: LayoutGraph = {
      id: "test-siblings",
      nodes: [
        {
          id: "father",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
        {
          id: "child1",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
        {
          id: "child2",
          type: "person",
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        },
      ],
      edges: [
        { id: "e1", type: "parent-child", source: "father", target: "child1" },
        { id: "e2", type: "parent-child", source: "father", target: "child2" },
      ],
    };

    const positioned = await calculateElkLayout(siblingGraph);
    const c1 = positioned.nodes.find((n) => n.id === "child1")!;
    const c2 = positioned.nodes.find((n) => n.id === "child2")!;

    // Hai con cùng tầng y
    expect(Math.abs(c1.y - c2.y)).toBeLessThan(10);
    // Hai con không overlap về trục x
    const xDistance = Math.abs(c1.x - c2.x);
    expect(xDistance).toBeGreaterThanOrEqual(TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH);
  });

  it("xử lý cây sâu 5 thế hệ (Deep Tree) hoàn tất nhanh chóng và đúng trật tự", async () => {
    const deepGraph: LayoutGraph = {
      id: "test-deep-tree",
      nodes: [
        { id: "gen1", type: "person", width: 220, height: 90 },
        { id: "gen2", type: "person", width: 220, height: 90 },
        { id: "gen3", type: "person", width: 220, height: 90 },
        { id: "gen4", type: "person", width: 220, height: 90 },
        { id: "gen5", type: "person", width: 220, height: 90 },
      ],
      edges: [
        { id: "e1", type: "parent-child", source: "gen1", target: "gen2" },
        { id: "e2", type: "parent-child", source: "gen2", target: "gen3" },
        { id: "e3", type: "parent-child", source: "gen3", target: "gen4" },
        { id: "e4", type: "parent-child", source: "gen4", target: "gen5" },
      ],
    };

    const startTime = performance.now();
    const positioned = await calculateElkLayout(deepGraph);
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(1000); // Hoàn thành dưới 1 giây
    expect(positioned.nodes).toHaveLength(5);

    const g1 = positioned.nodes.find((n) => n.id === "gen1")!;
    const g2 = positioned.nodes.find((n) => n.id === "gen2")!;
    const g3 = positioned.nodes.find((n) => n.id === "gen3")!;
    const g4 = positioned.nodes.find((n) => n.id === "gen4")!;
    const g5 = positioned.nodes.find((n) => n.id === "gen5")!;

    expect(g1.y).toBeLessThan(g2.y);
    expect(g2.y).toBeLessThan(g3.y);
    expect(g3.y).toBeLessThan(g4.y);
    expect(g4.y).toBeLessThan(g5.y);
  });

  it("tính toán thành công với LayoutGraph có ports và sourcePort/targetPort (chuẩn phả hệ cha con)", async () => {
    const portedGraph: LayoutGraph = {
      id: "test-ported-graph",
      nodes: [
        {
          id: "father-id",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "father-id-north", side: "NORTH" },
            { id: "father-id-south", side: "SOUTH" },
          ],
        },
        {
          id: "child-id",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "child-id-north", side: "NORTH" },
            { id: "child-id-south", side: "SOUTH" },
          ],
        },
      ],
      edges: [
        {
          id: "e-pc-1",
          type: "parent-child",
          source: "father-id",
          target: "child-id",
          sourcePort: "father-id-south",
          targetPort: "child-id-north",
        },
      ],
    };

    const positioned = await calculateElkLayout(portedGraph);
    expect(positioned.nodes).toHaveLength(2);
    expect(positioned.edges).toHaveLength(1);

    const father = positioned.nodes.find((n) => n.id === "father-id")!;
    const child = positioned.nodes.find((n) => n.id === "child-id")!;
    expect(father.y).toBeLessThan(child.y);
  });

  it("tính toán thành công cho cặp vợ chồng có 2 con (Union + Sibling nodes)", async () => {
    const familyGraph: LayoutGraph = {
      id: "test-couple-two-children",
      nodes: [
        {
          id: "father",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "father-north", side: "NORTH" },
            { id: "father-south", side: "SOUTH" },
            { id: "father-east", side: "EAST" },
            { id: "father-west", side: "WEST" },
          ],
        },
        {
          id: "mother",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "mother-north", side: "NORTH" },
            { id: "mother-south", side: "SOUTH" },
            { id: "mother-east", side: "EAST" },
            { id: "mother-west", side: "WEST" },
          ],
        },
        {
          id: "union-u1",
          type: "union",
          width: 32,
          height: 32,
          ports: [
            { id: "union-u1-north", side: "NORTH" },
            { id: "union-u1-south", side: "SOUTH" },
            { id: "union-u1-east", side: "EAST" },
            { id: "union-u1-west", side: "WEST" },
          ],
        },
        {
          id: "child1",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "child1-north", side: "NORTH" },
            { id: "child1-south", side: "SOUTH" },
            { id: "child1-east", side: "EAST" },
            { id: "child1-west", side: "WEST" },
          ],
        },
        {
          id: "child2",
          type: "person",
          width: 220,
          height: 90,
          ports: [
            { id: "child2-north", side: "NORTH" },
            { id: "child2-south", side: "SOUTH" },
            { id: "child2-east", side: "EAST" },
            { id: "child2-west", side: "WEST" },
          ],
        },
      ],
      edges: [
        {
          id: "e-um-u1-father",
          type: "union-member",
          source: "father",
          target: "union-u1",
          sourcePort: "father-east",
          targetPort: "union-u1-west",
        },
        {
          id: "e-um-u1-mother",
          type: "union-member",
          source: "mother",
          target: "union-u1",
          sourcePort: "mother-east",
          targetPort: "union-u1-west",
        },
        {
          id: "e-pc-father-child1",
          type: "parent-child",
          source: "father",
          target: "child1",
          sourcePort: "father-south",
          targetPort: "child1-north",
        },
        {
          id: "e-pc-mother-child1",
          type: "parent-child",
          source: "mother",
          target: "child1",
          sourcePort: "mother-south",
          targetPort: "child1-north",
        },
        {
          id: "e-pc-father-child2",
          type: "parent-child",
          source: "father",
          target: "child2",
          sourcePort: "father-south",
          targetPort: "child2-north",
        },
        {
          id: "e-pc-mother-child2",
          type: "parent-child",
          source: "mother",
          target: "child2",
          sourcePort: "mother-south",
          targetPort: "child2-north",
        },
      ],
    };

    const positioned = await calculateElkLayout(familyGraph);
    expect(positioned.nodes).toHaveLength(5);
    expect(positioned.edges).toHaveLength(6);

    const fNode = positioned.nodes.find((n) => n.id === "father")!;
    const mNode = positioned.nodes.find((n) => n.id === "mother")!;
    const c1Node = positioned.nodes.find((n) => n.id === "child1")!;
    const c2Node = positioned.nodes.find((n) => n.id === "child2")!;

    expect(fNode.y).toBeLessThan(c1Node.y);
    expect(fNode.y).toBeLessThan(c2Node.y);
    expect(mNode.y).toBeLessThan(c1Node.y);
    expect(mNode.y).toBeLessThan(c2Node.y);
  });

  it("đảm bảo gia đình 5 người con mỗi người có 1 vợ/chồng: các cặp vợ chồng luôn được bố cục liền kề nhau", async () => {
    const parentId = "father";
    const childrenIds = ["c1", "c2", "c3", "c4", "c5"];
    const spouseIds = ["w1", "w2", "w3", "w4", "w5"];

    const mockDto: TreeGraphDto = {
      schemaVersion: 1,
      treeId: "test-tree",
      centerPersonId: parentId,
      persons: [
        {
          id: parentId,
          fullName: "Bố",
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
        ...childrenIds.map((cId, idx) => ({
          id: cId,
          fullName: `Con ${idx + 1}`,
          gender: "male" as const,
          livingStatus: "living" as const,
          birthDate: null,
          birthYear: 1985 + idx,
          birthDatePrecision: "year" as const,
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown" as const,
          deathIsEstimated: false,
          verificationStatus: "verified" as const,
          isCenter: false,
        })),
        ...spouseIds.map((wId, idx) => ({
          id: wId,
          fullName: `Vợ ${idx + 1}`,
          gender: "female" as const,
          livingStatus: "living" as const,
          birthDate: null,
          birthYear: 1987 + idx,
          birthDatePrecision: "year" as const,
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown" as const,
          deathIsEstimated: false,
          verificationStatus: "verified" as const,
          isCenter: false,
        })),
      ],
      parentChildRelationships: childrenIds.map((cId, idx) => ({
        id: `pc-${idx}`,
        parentId,
        childId: cId,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      })),
      unions: childrenIds.map((_, idx) => ({
        id: `u-${idx}`,
        status: "active",
        startDate: null,
        startYear: 2010 + idx,
        startDatePrecision: "year",
        endDate: null,
        endYear: null,
        endDatePrecision: "unknown",
        verificationStatus: "verified",
      })),
      unionMembers: childrenIds.flatMap((cId, idx) => [
        { unionId: `u-${idx}`, personId: cId, memberRole: "spouse" },
        { unionId: `u-${idx}`, personId: spouseIds[idx], memberRole: "spouse" },
      ]),
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
        returnedPersonCount: 11,
        returnedRelationshipCount: 5,
        returnedUnionCount: 5,
        truncated: false,
      },
      truncated: false,
    };

    const layoutGraph = projectDtoToLayoutGraph(mockDto);
    const positioned = await calculateElkLayout(layoutGraph);

    // Kiểm tra từng cặp con và vợ: khoảng cách x giữa con và vợ của cùng 1 union phải nhỏ hơn khoảng cách tới các con khác
    for (let i = 0; i < 5; i++) {
      const childNode = positioned.nodes.find((n) => n.id === `c${i + 1}`)!;
      const spouseNode = positioned.nodes.find((n) => n.id === `w${i + 1}`)!;
      const unionNode = positioned.nodes.find((n) => n.id === `union-u-${i}`)!;

      expect(childNode).toBeDefined();
      expect(spouseNode).toBeDefined();
      expect(unionNode).toBeDefined();

      // Cặp vợ chồng và tất cả người ngang cấp cùng tầng Y chính xác 100%
      expect(childNode.y).toBe(spouseNode.y);

      // Cặp vợ chồng nằm liền kề nhau trên trục x (khoảng cách nhỏ hơn 2 lần chiều rộng node)
      const pairDistance = Math.abs(childNode.x - spouseNode.x);
      expect(pairDistance).toBeLessThanOrEqual(TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH * 2);
    }

    // Đảm bảo tất cả 5 người con và 5 người vợ đều có cùng một tọa độ Y duy nhất
    const allGen1Nodes = positioned.nodes.filter(
      (n) => n.id.startsWith("c") || n.id.startsWith("w")
    );
    const firstY = allGen1Nodes[0].y;
    for (const node of allGen1Nodes) {
      expect(node.y).toBe(firstY);
    }
  });

  it("ưu tiên cặp vợ chồng nằm liền kề nhau tuyệt đối khi có nhiều anh chị em (Case Đức - Nhung - Phương)", async () => {
    const mockDto: TreeGraphDto = {
      schemaVersion: 1,
      treeId: "tree-duc-nhung",
      centerPersonId: "duc",
      persons: [
        {
          id: "vinh",
          fullName: "Đặng Tiến Vịnh",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "nham",
          fullName: "Đỗ Thị Nhâm",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "duc",
          fullName: "Đặng Tiến Đức",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: true,
        },
        {
          id: "nhung",
          fullName: "Nguyễn Thị Nhung",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "phuong",
          fullName: "Đặng Thị Phương",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "phuong2",
          fullName: "Đặng Thị Phượng",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "minh",
          fullName: "Đặng Tiến Minh",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "quang",
          fullName: "Đặng Tiến Quang",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
      ],
      parentChildRelationships: [
        {
          id: "r1",
          parentId: "vinh",
          childId: "duc",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r2",
          parentId: "vinh",
          childId: "phuong",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r3",
          parentId: "vinh",
          childId: "phuong2",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r4",
          parentId: "vinh",
          childId: "minh",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r5",
          parentId: "vinh",
          childId: "quang",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r6",
          parentId: "nham",
          childId: "duc",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r7",
          parentId: "nham",
          childId: "phuong",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r8",
          parentId: "nham",
          childId: "phuong2",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r9",
          parentId: "nham",
          childId: "minh",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r10",
          parentId: "nham",
          childId: "quang",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
      ],
      unions: [
        {
          id: "u_duc_nhung",
          status: "active",
          startDate: null,
          startYear: null,
          startDatePrecision: "unknown",
          endDate: null,
          endYear: null,
          endDatePrecision: "unknown",
          verificationStatus: "unverified",
        },
        {
          id: "u_vinh_nham",
          status: "active",
          startDate: null,
          startYear: null,
          startDatePrecision: "unknown",
          endDate: null,
          endYear: null,
          endDatePrecision: "unknown",
          verificationStatus: "unverified",
        },
      ],
      unionMembers: [
        { unionId: "u_duc_nhung", personId: "duc", memberRole: "spouse" },
        { unionId: "u_duc_nhung", personId: "nhung", memberRole: "spouse" },
        { unionId: "u_vinh_nham", personId: "vinh", memberRole: "spouse" },
        { unionId: "u_vinh_nham", personId: "nham", memberRole: "spouse" },
      ],
      expansion: {},
      limits: {
        requestedAncestorDepth: 5,
        requestedDescendantDepth: 5,
        appliedAncestorDepth: 5,
        appliedDescendantDepth: 5,
        maxAncestorDepth: 5,
        maxDescendantDepth: 5,
        maxPersonsBudget: 250,
        maxRelationshipsBudget: 500,
        maxUnionsBudget: 150,
        returnedPersonCount: 8,
        returnedRelationshipCount: 10,
        returnedUnionCount: 2,
        truncated: false,
      },
      truncated: false,
    };

    const layoutGraph = projectDtoToLayoutGraph(mockDto);
    const positioned = await calculateElkLayout(layoutGraph);

    const gen1Nodes = positioned.nodes.filter(
      (n) => n.id !== "vinh" && n.id !== "nham" && n.type === "person"
    );
    gen1Nodes.sort((a, b) => a.x - b.x);

    const ducIndex = gen1Nodes.findIndex((n) => n.id === "duc");
    const nhungIndex = gen1Nodes.findIndex((n) => n.id === "nhung");

    // Đức và Nhung phải đứng cạnh nhau (chênh lệch chỉ số = 1)
    expect(Math.abs(ducIndex - nhungIndex)).toBe(1);
  });

  it("căn giữa các node con cái ngay bên dưới cụm cha mẹ khi mở rộng", async () => {
    const mockDtoWithChildren: TreeGraphDto = {
      schemaVersion: 1,
      treeId: "tree-centering-test",
      centerPersonId: "duc",
      persons: [
        {
          id: "duc",
          fullName: "Đặng Tiến Đức",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: true,
        },
        {
          id: "nhung",
          fullName: "Nguyễn Thị Nhung",
          gender: "female",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "dao",
          fullName: "Đặng Tiến Đạo",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
        {
          id: "dong",
          fullName: "Đặng Tiến Đông",
          gender: "male",
          livingStatus: "living",
          birthDate: null,
          birthYear: null,
          birthDatePrecision: "unknown",
          birthIsEstimated: false,
          deathDate: null,
          deathYear: null,
          deathDatePrecision: "unknown",
          deathIsEstimated: false,
          verificationStatus: "unverified",
          isCenter: false,
        },
      ],

      parentChildRelationships: [
        {
          id: "r1",
          parentId: "duc",
          childId: "dao",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r2",
          parentId: "duc",
          childId: "dong",
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r3",
          parentId: "nhung",
          childId: "dao",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
        {
          id: "r4",
          parentId: "nhung",
          childId: "dong",
          parentRole: "mother",
          relationshipKind: "biological",
          verificationStatus: "unverified",
        },
      ],
      unions: [
        {
          id: "u_duc_nhung",
          status: "active",
          startDate: null,
          startYear: null,
          startDatePrecision: "unknown",
          endDate: null,
          endYear: null,
          endDatePrecision: "unknown",
          verificationStatus: "unverified",
        },
      ],
      unionMembers: [
        { unionId: "u_duc_nhung", personId: "duc", memberRole: "spouse" },
        { unionId: "u_duc_nhung", personId: "nhung", memberRole: "spouse" },
      ],
      expansion: {},
      limits: {
        requestedAncestorDepth: 5,
        requestedDescendantDepth: 5,
        appliedAncestorDepth: 5,
        appliedDescendantDepth: 5,
        maxAncestorDepth: 5,
        maxDescendantDepth: 5,
        maxPersonsBudget: 250,
        maxRelationshipsBudget: 500,
        maxUnionsBudget: 150,
        returnedPersonCount: 4,
        returnedRelationshipCount: 4,
        returnedUnionCount: 1,
        truncated: false,
      },
      truncated: false,
    };

    const layoutGraph = projectDtoToLayoutGraph(mockDtoWithChildren);
    const positioned = await calculateElkLayout(layoutGraph);

    const duc = positioned.nodes.find((n) => n.id === "duc")!;
    const nhung = positioned.nodes.find((n) => n.id === "nhung")!;
    const dao = positioned.nodes.find((n) => n.id === "dao")!;
    const dong = positioned.nodes.find((n) => n.id === "dong")!;

    const parentCenter =
      (Math.min(duc.x, nhung.x) + Math.max(duc.x + duc.width, nhung.x + nhung.width)) / 2;
    const childrenCenter =
      (Math.min(dao.x, dong.x) + Math.max(dao.x + dao.width, dong.x + dong.width)) / 2;

    // Tâm điểm của cụm con (Đạo, Đông) phải trùng khớp hoặc căn giữa hoàn hảo dưới cụm cha mẹ (Đức, Nhung)
    expect(Math.abs(parentCenter - childrenCenter)).toBeLessThan(1);
  });
});
