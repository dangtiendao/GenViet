import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";
import type { ElkWorkerLayoutRequest, ElkWorkerLayoutResponse } from "./elk-worker.types";

/**
 * Web Worker phụ trách tính toán bố cục ELK phân tầng ngoài main thread (P23-T14)
 */
self.addEventListener("message", async (event: MessageEvent<ElkWorkerLayoutRequest>) => {
  const { requestId, graph, options } = event.data;
  const startTime = performance.now();

  try {
    const layouted = await calculateElkLayout(graph, options);
    const durationMs = performance.now() - startTime;

    const response: ElkWorkerLayoutResponse = {
      requestId,
      success: true,
      result: layouted,
      durationMs,
    };

    self.postMessage(response);
  } catch (err: any) {
    const response: ElkWorkerLayoutResponse = {
      requestId,
      success: false,
      errorCode: "LAYOUT_WORKER_COMPUTE_FAILED",
      errorMessage: err?.message || "Lỗi tính toán bố cục ELK trong Web Worker",
    };

    self.postMessage(response);
  }
});
