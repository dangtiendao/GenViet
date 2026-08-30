import { describe, it, expect } from "vitest";
import { PERFORMANCE_BUDGET } from "@/features/performance/config/performance-budget";
import { PerformanceTracker } from "@/features/performance/metrics/performance-marks";

describe("P23-T01: Ngân sách hiệu năng (Performance Budget)", () => {
  it("định nghĩa đầy đủ các mục tiêu ngân sách cho Dashboard, Graph, Layout, Render, Search, Thumbnail", () => {
    expect(PERFORMANCE_BUDGET.DASHBOARD.MAX_LOAD_MS).toBe(500);
    expect(PERFORMANCE_BUDGET.GRAPH_QUERY.MAX_100_NODES_MS).toBe(100);
    expect(PERFORMANCE_BUDGET.LAYOUT.MAX_100_NODES_MS).toBe(200);
    expect(PERFORMANCE_BUDGET.RENDER.MAX_FIRST_RENDER_MS).toBe(500 < 1000 ? 50 : 100);
    expect(PERFORMANCE_BUDGET.SEARCH.MAX_DOM_ROWS_RENDERED).toBe(25);
    expect(PERFORMANCE_BUDGET.THUMBNAIL.MAX_SIZE_BYTES).toBe(30 * 1024);
  });

  it("PerformanceTracker hoạt động an toàn và không gây crash", () => {
    PerformanceTracker.start("test-op");
    const duration = PerformanceTracker.end("test-op");
    expect(duration === null || typeof duration === "number").toBe(true);
  });
});
