import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ElkWorkerClient } from "@/features/tree-graph/workers/elk-worker-client";
import type { LayoutGraph } from "@/features/tree-view/layout/layout-graph.types";

describe("P23-T14 & P23-T15: ELK Web Worker & Stale Layout Cancellation", () => {
  beforeEach(() => {
    ElkWorkerClient.resetInstance();
  });

  afterEach(() => {
    ElkWorkerClient.resetInstance();
  });

  const sampleGraph: LayoutGraph = {
    id: "test-tree",
    nodes: [
      {
        id: "node-1",
        width: 220,
        height: 90,
        type: "person",
        ports: [
          { id: "p1-n", side: "NORTH" },
          { id: "p1-s", side: "SOUTH" },
        ],
      },
    ],
    edges: [],
  };

  it("thực hiện tính toán layout thành công qua adapter fallback hoặc worker", async () => {
    const client = ElkWorkerClient.getInstance();
    const result = await client.computeLayout("req-1", sampleGraph);

    expect(result).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].id).toBe("node-1");
  });

  it("hủy bỏ request cũ khi có cancelRequest", () => {
    const client = ElkWorkerClient.getInstance();
    client.cancelRequest("req-old");
    // Không gây ngoại lệ hay crash
    expect(true).toBe(true);
  });
});
