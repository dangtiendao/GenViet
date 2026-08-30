import ELK, { type ElkNode, type ElkExtendedEdge } from "elkjs/lib/elk.bundled.js";
import type {
  LayoutGraph,
  PositionedLayoutGraph,
  PositionedNode,
  PositionedEdge,
} from "./layout-graph.types";
import { DEFAULT_ELK_LAYOUT_OPTIONS } from "./elk-layout-options";
import { TreeViewDomainError, TREE_VIEW_ERROR_CODES } from "../errors/tree-view.errors";

// Khởi tạo một singleton ELK instance
const elkInstance = new ELK();

/**
 * Adapter chạy thuật toán ELK.js tính toán tọa độ phân tầng cho LayoutGraph
 */
export async function calculateElkLayout(
  graph: LayoutGraph,
  options: Record<string, string> = DEFAULT_ELK_LAYOUT_OPTIONS
): Promise<PositionedLayoutGraph> {
  if (!graph.nodes || graph.nodes.length === 0) {
    return {
      id: graph.id,
      width: 0,
      height: 0,
      nodes: [],
      edges: [],
    };
  }

  // 1. Chuyển đổi LayoutGraph sang ElkNode format
  const elkChildren: ElkNode[] = graph.nodes.map((n) => ({
    id: n.id,
    width: n.width,
    height: n.height,
    ports: n.ports?.map((p) => ({
      id: p.id,
      properties: {
        "port.side": p.side,
      },
    })),
  }));

  const elkEdges: ElkExtendedEdge[] = graph.edges.map((e) => ({
    id: e.id,
    sources: [e.sourcePort ? `${e.source}:${e.sourcePort}` : e.source],
    targets: [e.targetPort ? `${e.target}:${e.targetPort}` : e.target],
  }));

  const elkRootNode: ElkNode = {
    id: graph.id,
    layoutOptions: options,
    children: elkChildren,
    edges: elkEdges,
  };

  try {
    // 2. Thực thi tính toán layout bất đồng bộ
    const layouted = await elkInstance.layout(elkRootNode);

    const positionedNodes: PositionedNode[] = (layouted.children || []).map((child) => {
      const originalNode = graph.nodes.find((n) => n.id === child.id)!;
      return {
        ...originalNode,
        x: child.x ?? 0,
        y: child.y ?? 0,
      };
    });

    const positionedEdges: PositionedEdge[] = (layouted.edges || []).map((edge) => {
      const originalEdge = graph.edges.find((e) => e.id === edge.id)!;
      const sections = (edge.sections || []).map((sec) => ({
        startPoint: { x: sec.startPoint.x, y: sec.startPoint.y },
        endPoint: { x: sec.endPoint.x, y: sec.endPoint.y },
        bendPoints: sec.bendPoints?.map((bp) => ({ x: bp.x, y: bp.y })),
      }));

      return {
        ...originalEdge,
        sections,
      };
    });

    return {
      id: graph.id,
      width: layouted.width ?? 0,
      height: layouted.height ?? 0,
      nodes: positionedNodes,
      edges: positionedEdges,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new TreeViewDomainError(
      TREE_VIEW_ERROR_CODES.LAYOUT_FAILED,
      `Tính toán bố cục ELK thất bại: ${msg}`
    );
  }
}
