import type {
  LayoutGraph,
  PositionedLayoutGraph,
} from "@/features/tree-view/layout/layout-graph.types";
import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";
import type { ElkWorkerLayoutRequest, ElkWorkerLayoutResponse } from "./elk-worker.types";
import {
  TreeViewDomainError,
  TREE_VIEW_ERROR_CODES,
} from "@/features/tree-view/errors/tree-view.errors";

export class ElkWorkerClient {
  private static instance: ElkWorkerClient | null = null;
  private worker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (value: PositionedLayoutGraph) => void;
      reject: (reason: any) => void;
    }
  >();
  private activeRequestId: string | null = null;

  static getInstance(): ElkWorkerClient {
    if (!ElkWorkerClient.instance) {
      ElkWorkerClient.instance = new ElkWorkerClient();
    }
    return ElkWorkerClient.instance;
  }

  static resetInstance(): void {
    if (ElkWorkerClient.instance) {
      ElkWorkerClient.instance.terminate();
      ElkWorkerClient.instance = null;
    }
  }

  private initWorker(): boolean {
    if (this.worker) return true;
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      return false;
    }

    try {
      this.worker = new Worker(new URL("./elk-layout.worker.ts", import.meta.url), {
        type: "module",
      });

      this.worker.onmessage = (event: MessageEvent<ElkWorkerLayoutResponse>) => {
        const response = event.data;
        const pending = this.pendingRequests.get(response.requestId);
        if (!pending) return;

        this.pendingRequests.delete(response.requestId);

        // Bỏ qua kết quả nếu đây không phải là layout request mới nhất (Stale Layout Cancellation)
        if (response.requestId !== this.activeRequestId) {
          return;
        }

        if (response.success) {
          pending.resolve(response.result);
        } else {
          pending.reject(
            new TreeViewDomainError(TREE_VIEW_ERROR_CODES.LAYOUT_FAILED, response.errorMessage)
          );
        }
      };

      this.worker.onerror = (err) => {
        console.error("ELK Web Worker Error:", err);
      };

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Tính toán bố cục qua Web Worker (có hủy request cũ và fallback sang main thread)
   */
  async computeLayout(
    requestId: string,
    graph: LayoutGraph,
    options?: Record<string, string>
  ): Promise<PositionedLayoutGraph> {
    this.activeRequestId = requestId;

    const hasWorker = this.initWorker();

    if (!hasWorker || !this.worker) {
      // Fallback nếu môi trường không hỗ trợ Web Worker (Node/SSR/Test)
      return calculateElkLayout(graph, options);
    }

    return new Promise<PositionedLayoutGraph>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      const message: ElkWorkerLayoutRequest = {
        requestId,
        graph,
        options,
      };

      this.worker!.postMessage(message);
    });
  }

  /**
   * Hủy layout request cũ
   */
  cancelRequest(requestId: string): void {
    this.pendingRequests.delete(requestId);
    if (this.activeRequestId === requestId) {
      this.activeRequestId = null;
    }
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
    this.activeRequestId = null;
  }
}
