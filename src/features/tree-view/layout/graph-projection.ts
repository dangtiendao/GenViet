import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import type { LayoutGraph, LayoutNode, LayoutEdge } from "./layout-graph.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";
import { calculateHiddenPersonIds } from "./branch-visibility";

/**
 * Pure Projection Function: Chuyển đổi TreeGraphDto sang LayoutGraph độc lập
 */
export function projectDtoToLayoutGraph(
  dto: TreeGraphDto,
  collapsedPersonIds: Set<string> = new Set()
): LayoutGraph {
  const hiddenPersonIds = calculateHiddenPersonIds(dto, collapsedPersonIds);

  // 1. Tạo Person Layout Nodes
  const nodes: LayoutNode[] = [];
  const visiblePersonIdSet = new Set<string>();

  for (const person of dto.persons) {
    if (hiddenPersonIds.has(person.id)) continue;

    visiblePersonIdSet.add(person.id);
    nodes.push({
      id: person.id,
      type: "person",
      width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
      height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
      ports: [
        { id: `${person.id}-north`, side: "NORTH" },
        { id: `${person.id}-south`, side: "SOUTH" },
        { id: `${person.id}-east`, side: "EAST" },
        { id: `${person.id}-west`, side: "WEST" },
      ],
      labels: [{ text: person.fullName }],
    });
  }

  // 2. Tạo Union Layout Nodes (cho các union có ít nhất 1 thành viên hiển thị)
  const visibleUnionIdSet = new Set<string>();
  const unionMap = new Map(dto.unions.map((u) => [u.id, u]));

  for (const member of dto.unionMembers) {
    if (visiblePersonIdSet.has(member.personId) && unionMap.has(member.unionId)) {
      visibleUnionIdSet.add(member.unionId);
    }
  }

  for (const unionId of Array.from(visibleUnionIdSet).sort()) {
    nodes.push({
      id: `union-${unionId}`,
      type: "union",
      width: TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH,
      height: TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT,
      ports: [
        { id: `union-${unionId}-north`, side: "NORTH" },
        { id: `union-${unionId}-south`, side: "SOUTH" },
        { id: `union-${unionId}-east`, side: "EAST" },
        { id: `union-${unionId}-west`, side: "WEST" },
      ],
    });
  }

  // 3. Tạo Layout Edges
  const edges: LayoutEdge[] = [];
  const edgeIdSet = new Set<string>();

  // 3.1. Parent-Child Edges (Parent -> Child)
  for (const rel of dto.parentChildRelationships) {
    if (visiblePersonIdSet.has(rel.parentId) && visiblePersonIdSet.has(rel.childId)) {
      const edgeId = `e-pc-${rel.id}`;
      if (!edgeIdSet.has(edgeId)) {
        edgeIdSet.add(edgeId);
        edges.push({
          id: edgeId,
          type: "parent-child",
          source: rel.parentId,
          target: rel.childId,
          sourcePort: `${rel.parentId}-south`,
          targetPort: `${rel.childId}-north`,
        });
      }
    }
  }

  // 3.2. Union-Member Edges (Person <-> UnionNode)
  for (const member of dto.unionMembers) {
    const unionNodeId = `union-${member.unionId}`;
    if (visiblePersonIdSet.has(member.personId) && visibleUnionIdSet.has(member.unionId)) {
      const edgeId = `e-um-${member.unionId}-${member.personId}`;
      if (!edgeIdSet.has(edgeId)) {
        edgeIdSet.add(edgeId);
        edges.push({
          id: edgeId,
          type: "union-member",
          source: member.personId,
          target: unionNodeId,
          sourcePort: `${member.personId}-east`,
          targetPort: `${unionNodeId}-west`,
        });
      }
    }
  }

  // Sắp xếp deterministic
  nodes.sort((a, b) => a.id.localeCompare(b.id));
  edges.sort((a, b) => a.id.localeCompare(b.id));

  return {
    id: `layout-${dto.treeId}`,
    nodes,
    edges,
  };
}
