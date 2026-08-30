import type { PositionedLayoutGraph } from "./layout-graph.types";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import type {
  ReactFlowTreeNode,
  ReactFlowTreeEdge,
  PersonNodeData,
  UnionNodeData,
} from "../types/tree-presentation.types";

export interface PresentationMapOptions {
  selectedPersonId?: string | null;
  collapsedPersonIds?: Set<string>;
  treeId: string;
  canWrite?: boolean;
  onSelect?: (personId: string) => void;
  onExpandAncestors?: (personId: string) => void;
  onExpandDescendants?: (personId: string) => void;
  onToggleCollapse?: (personId: string) => void;
  onChangeCenter?: (personId: string) => void;
}

/**
 * Pure Mapper: Chuyển đổi PositionedLayoutGraph và TreeGraphDto sang React Flow Nodes & Edges
 */
export function mapLayoutToReactFlow(
  positionedGraph: PositionedLayoutGraph,
  dto: TreeGraphDto,
  options: PresentationMapOptions
): { nodes: ReactFlowTreeNode[]; edges: ReactFlowTreeEdge[] } {
  const personMap = new Map(dto.persons.map((p) => [p.id, p]));
  const unionMap = new Map(dto.unions.map((u) => [u.id, u]));
  const relMap = new Map(dto.parentChildRelationships.map((r) => [r.id, r]));

  // 1. Tạo React Flow Nodes
  const nodes: ReactFlowTreeNode[] = [];

  for (const pNode of positionedGraph.nodes) {
    if (pNode.type === "person") {
      const person = personMap.get(pNode.id);
      if (!person) continue;

      const isCenter = person.id === dto.centerPersonId;
      const isSelected = person.id === options.selectedPersonId;
      const expansion = dto.expansion[person.id];
      const isCollapsed = options.collapsedPersonIds?.has(person.id);

      const nodeData: PersonNodeData = {
        person,
        isCenter,
        isSelected,
        expansion,
        isCollapsed,
        treeId: options.treeId,
        canWrite: options.canWrite,
        onSelect: options.onSelect,
        onExpandAncestors: options.onExpandAncestors,
        onExpandDescendants: options.onExpandDescendants,
        onToggleCollapse: options.onToggleCollapse,
        onChangeCenter: options.onChangeCenter,
      };

      nodes.push({
        id: person.id,
        type: "person",
        position: { x: pNode.x, y: pNode.y },
        data: nodeData,
        draggable: false,
        selectable: true,
      });
    } else if (pNode.type === "union") {
      const rawUnionId = pNode.id.replace(/^union-/, "");
      const union = unionMap.get(rawUnionId);

      const nodeData: UnionNodeData = {
        unionId: rawUnionId,
        status: union?.status || "active",
        verificationStatus: union?.verificationStatus || "unverified",
      };

      nodes.push({
        id: pNode.id,
        type: "union",
        position: { x: pNode.x, y: pNode.y },
        data: nodeData,
        draggable: false,
        selectable: false,
      });
    }
  }

  // 2. Tạo React Flow Edges
  const edges: ReactFlowTreeEdge[] = [];

  for (const pEdge of positionedGraph.edges) {
    if (pEdge.type === "parent-child") {
      const rawRelId = pEdge.id.replace(/^e-pc-/, "");
      const rel = relMap.get(rawRelId);

      edges.push({
        id: pEdge.id,
        type: "parent-child",
        source: pEdge.source,
        target: pEdge.target,
        data: {
          relationshipId: rawRelId,
          parentRole: rel?.parentRole || "unspecified",
          relationshipKind: rel?.relationshipKind || "biological",
          verificationStatus: rel?.verificationStatus || "unverified",
        },
      });
    } else if (pEdge.type === "union-member") {
      // e-um-[unionId]-[personId]
      const parts = pEdge.id.split("-");
      const unionId = parts[2] || "";
      const personId = parts[3] || "";

      edges.push({
        id: pEdge.id,
        type: "union-member",
        source: pEdge.source,
        target: pEdge.target,
        data: {
          unionId,
          personId,
          memberRole: "spouse",
        },
      });
    }
  }

  return { nodes, edges };
}
