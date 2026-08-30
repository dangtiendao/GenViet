import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import type { LayoutGraph, LayoutNode, LayoutEdge, SpousePair } from "./layout-graph.types";

import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";
import { calculateHiddenPersonIds } from "./branch-visibility";

/**
 * Tính toán thế hệ (Generation) cho từng nhân vật để phân vùng cùng tầng (ELK Partitioning & Y-Alignment)
 */
export function calculatePersonGenerations(dto: TreeGraphDto): Map<string, number> {
  const genMap = new Map<string, number>();

  // 1. Tìm các đỉnh gốc (Roots = những người không có cha mẹ trong DTO)
  const childSet = new Set(dto.parentChildRelationships.map((r) => r.childId));
  const rootPersons = dto.persons.filter((p) => !childSet.has(p.id));

  for (const root of rootPersons) {
    genMap.set(root.id, 0);
  }

  if (genMap.size === 0 && dto.centerPersonId) {
    genMap.set(dto.centerPersonId, 0);
  }

  let changed = true;
  let iterations = 0;
  const maxIterations = 100;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // 2. Lan truyền qua quan hệ cha-con (Con = max(cha, mẹ) + 1)
    for (const rel of dto.parentChildRelationships) {
      const pGen = genMap.get(rel.parentId);
      const cGen = genMap.get(rel.childId);

      if (pGen !== undefined) {
        const targetChildGen = pGen + 1;
        if (cGen === undefined || cGen < targetChildGen) {
          genMap.set(rel.childId, targetChildGen);
          changed = true;
        }
      } else if (cGen !== undefined) {
        const targetParentGen = cGen - 1;
        if (pGen === undefined) {
          genMap.set(rel.parentId, targetParentGen);
          changed = true;
        }
      }
    }

    // 3. Lan truyền qua quan hệ hôn nhân (Vợ và Chồng luôn cùng thế hệ)
    for (const u of dto.unions) {
      const members = dto.unionMembers.filter((m) => m.unionId === u.id);
      let maxKnownGen: number | undefined;

      for (const m of members) {
        const g = genMap.get(m.personId);
        if (g !== undefined && (maxKnownGen === undefined || g > maxKnownGen)) {
          maxKnownGen = g;
        }
      }

      if (maxKnownGen !== undefined) {
        for (const m of members) {
          if (genMap.get(m.personId) !== maxKnownGen) {
            genMap.set(m.personId, maxKnownGen);
            changed = true;
          }
        }
      }
    }
  }

  for (const p of dto.persons) {
    if (!genMap.has(p.id)) {
      genMap.set(p.id, 0);
    }
  }

  // Chuẩn hóa partition về số nguyên không âm (0, 1, 2, 3...)
  let minGen = Infinity;
  for (const g of genMap.values()) {
    if (g < minGen) minGen = g;
  }
  if (minGen === Infinity) minGen = 0;

  const normalizedMap = new Map<string, number>();
  for (const [pId, g] of genMap.entries()) {
    normalizedMap.set(pId, g - minGen);
  }

  return normalizedMap;
}

/**
 * Pure Projection Function: Chuyển đổi TreeGraphDto sang LayoutGraph độc lập
 */
export function projectDtoToLayoutGraph(
  dto: TreeGraphDto,
  collapsedPersonIds: Set<string> = new Set()
): LayoutGraph {
  const hiddenPersonIds = calculateHiddenPersonIds(dto, collapsedPersonIds);
  const generationMap = calculatePersonGenerations(dto);

  // 1. Tạo Person Layout Nodes
  const nodes: LayoutNode[] = [];
  const visiblePersonIdSet = new Set<string>();

  for (const person of dto.persons) {
    if (hiddenPersonIds.has(person.id)) continue;

    const partition = generationMap.get(person.id) ?? 0;
    visiblePersonIdSet.add(person.id);
    nodes.push({
      id: person.id,
      type: "person",
      width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
      height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
      layoutOptions: {
        "elk.partitioning.partition": String(partition),
      },
      ports: [
        { id: `${person.id}-north`, side: "NORTH" },
        { id: `${person.id}-south`, side: "SOUTH" },
        { id: `${person.id}-east`, side: "EAST" },
        { id: `${person.id}-west`, side: "WEST" },
      ],
      labels: [{ text: person.fullName }],
    });
  }

  // Tập hợp các parentId có con đang hiển thị trên cây
  const parentsWithVisibleChildren = new Set<string>();
  for (const rel of dto.parentChildRelationships) {
    if (visiblePersonIdSet.has(rel.parentId) && visiblePersonIdSet.has(rel.childId)) {
      parentsWithVisibleChildren.add(rel.parentId);
    }
  }

  // 2. Tạo Union Layout Nodes (tạm ẩn cho các union đã có con hiển thị vì đã có đường kết nối cha-mẹ-con)
  const visibleUnionIdSet = new Set<string>();
  const unionMap = new Map(dto.unions.map((u) => [u.id, u]));

  for (const member of dto.unionMembers) {
    if (visiblePersonIdSet.has(member.personId) && unionMap.has(member.unionId)) {
      const unionMembers = dto.unionMembers.filter((m) => m.unionId === member.unionId);
      const hasVisibleChildren = unionMembers.some((m) =>
        parentsWithVisibleChildren.has(m.personId)
      );

      // Chỉ hiển thị đường nối vợ chồng nếu cặp này CHƯA có con hiển thị trên cây
      if (!hasVisibleChildren) {
        visibleUnionIdSet.add(member.unionId);
      }
    }
  }

  for (const unionId of Array.from(visibleUnionIdSet).sort()) {
    const members = dto.unionMembers.filter((m) => m.unionId === unionId);
    const memberPartitions = members
      .map((m) => generationMap.get(m.personId))
      .filter((p): p is number => p !== undefined);
    const unionPartition = memberPartitions.length > 0 ? Math.max(...memberPartitions) : 0;

    nodes.push({
      id: `union-${unionId}`,
      type: "union",
      width: TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH,
      height: TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT,
      layoutOptions: {
        "elk.partitioning.partition": String(unionPartition),
      },
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

  // 3.2. Trích xuất toàn bộ các cặp vợ chồng (Spouse Pairs) hiển thị trên cây để layout luôn giữ họ liền kề
  const allMembersByUnion = new Map<string, typeof dto.unionMembers>();
  for (const member of dto.unionMembers) {
    if (visiblePersonIdSet.has(member.personId)) {
      const list = allMembersByUnion.get(member.unionId) || [];
      list.push(member);
      allMembersByUnion.set(member.unionId, list);
    }
  }

  const personMap = new Map(dto.persons.map((p) => [p.id, p]));
  const childPersonIds = new Set(dto.parentChildRelationships.map((r) => r.childId));
  const spousePairs: SpousePair[] = [];

  for (const [, members] of allMembersByUnion.entries()) {
    if (members.length >= 2) {
      const sorted = [...members].sort((a, b) => {
        const pA = personMap.get(a.personId);
        const pB = personMap.get(b.personId);
        const isBloodA = childPersonIds.has(a.personId) || a.personId === dto.centerPersonId;
        const isBloodB = childPersonIds.has(b.personId) || b.personId === dto.centerPersonId;

        if (isBloodA && !isBloodB) return -1;
        if (!isBloodA && isBloodB) return 1;

        if (pA?.gender === "male" && pB?.gender === "female") return -1;
        if (pA?.gender === "female" && pB?.gender === "male") return 1;

        return a.personId.localeCompare(b.personId);
      });

      spousePairs.push({
        person1Id: sorted[0].personId,
        person2Id: sorted[1].personId,
      });
    }
  }

  // 3.3. Union-Member Edges (Chỉ vẽ khi cặp vợ chồng chưa có con hiển thị)
  const membersByUnion = new Map<string, typeof dto.unionMembers>();
  for (const member of dto.unionMembers) {
    if (visiblePersonIdSet.has(member.personId) && visibleUnionIdSet.has(member.unionId)) {
      const list = membersByUnion.get(member.unionId) || [];
      list.push(member);
      membersByUnion.set(member.unionId, list);
    }
  }

  for (const [unionId, members] of membersByUnion.entries()) {
    const unionNodeId = `union-${unionId}`;

    if (members.length === 1) {
      const m = members[0];
      const edgeId = `e-um-${unionId}-${m.personId}`;
      if (!edgeIdSet.has(edgeId)) {
        edgeIdSet.add(edgeId);
        edges.push({
          id: edgeId,
          type: "union-member",
          source: m.personId,
          target: unionNodeId,
          sourcePort: `${m.personId}-east`,
          targetPort: `${unionNodeId}-west`,
        });
      }
    } else if (members.length >= 2) {
      // Sắp xếp: người có huyết thống (con cái/tâm điểm) hoặc nam ở bên trái, người phối ngẫu ở bên phải
      const sortedMembers = [...members].sort((a, b) => {
        const pA = personMap.get(a.personId);
        const pB = personMap.get(b.personId);
        const isBloodA = childPersonIds.has(a.personId) || a.personId === dto.centerPersonId;
        const isBloodB = childPersonIds.has(b.personId) || b.personId === dto.centerPersonId;

        if (isBloodA && !isBloodB) return -1;
        if (!isBloodA && isBloodB) return 1;

        if (pA?.gender === "male" && pB?.gender === "female") return -1;
        if (pA?.gender === "female" && pB?.gender === "male") return 1;

        return a.personId.localeCompare(b.personId);
      });

      const mLeft = sortedMembers[0];
      const mRight = sortedMembers[1];

      // Cạnh nối ngang trực tiếp giữa 2 vợ chồng (mLeft.East ➔ mRight.West)
      const edgeId = `e-um-${unionId}`;
      if (!edgeIdSet.has(edgeId)) {
        edgeIdSet.add(edgeId);
        edges.push({
          id: edgeId,
          type: "union-member",
          source: mLeft.personId,
          target: mRight.personId,
          sourcePort: `${mLeft.personId}-east`,
          targetPort: `${mRight.personId}-west`,
          layoutOptions: {
            "elk.layered.priority.direction": "100",
            "elk.layered.priority.shortness": "100",
            "elk.weight": "100",
          },
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
    spousePairs,
  };
}
