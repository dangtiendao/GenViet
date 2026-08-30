export type LayoutNodeType = "person" | "union";
export type LayoutEdgeType = "parent-child" | "union-member";

export interface LayoutPort {
  id: string;
  side: "NORTH" | "SOUTH" | "EAST" | "WEST";
}

export interface LayoutNode {
  id: string;
  type: LayoutNodeType;
  width: number;
  height: number;
  ports?: LayoutPort[];
  labels?: Array<{ text: string }>;
}

export interface LayoutEdge {
  id: string;
  type: LayoutEdgeType;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
}

export interface LayoutGraph {
  id: string;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

export interface PositionedNode extends LayoutNode {
  x: number;
  y: number;
}

export interface PositionedEdgeSection {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  bendPoints?: Array<{ x: number; y: number }>;
}

export interface PositionedEdge extends LayoutEdge {
  sections?: PositionedEdgeSection[];
}

export interface PositionedLayoutGraph {
  id: string;
  width: number;
  height: number;
  nodes: PositionedNode[];
  edges: PositionedEdge[];
}
