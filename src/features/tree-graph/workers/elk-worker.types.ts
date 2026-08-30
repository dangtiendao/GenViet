import type {
  LayoutGraph,
  PositionedLayoutGraph,
} from "@/features/tree-view/layout/layout-graph.types";

export interface ElkWorkerLayoutRequest {
  requestId: string;
  graph: LayoutGraph;
  options?: Record<string, string>;
}

export interface ElkWorkerLayoutSuccessResponse {
  requestId: string;
  success: true;
  result: PositionedLayoutGraph;
  durationMs: number;
}

export interface ElkWorkerLayoutErrorResponse {
  requestId: string;
  success: false;
  errorCode: string;
  errorMessage: string;
}

export type ElkWorkerLayoutResponse = ElkWorkerLayoutSuccessResponse | ElkWorkerLayoutErrorResponse;
