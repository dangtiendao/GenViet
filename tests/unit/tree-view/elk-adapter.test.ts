import { describe, it, expect } from "vitest";
import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";
import type { LayoutGraph } from "@/features/tree-view/layout/layout-graph.types";
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
});
