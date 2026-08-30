import ELKConstructor, {
  type ElkNode,
  type ElkExtendedEdge,
  type ELK as ELKInterface,
} from "elkjs/lib/elk.bundled.js";
import type {
  LayoutGraph,
  PositionedLayoutGraph,
  PositionedNode,
  PositionedEdge,
} from "./layout-graph.types";
import { DEFAULT_ELK_LAYOUT_OPTIONS } from "./elk-layout-options";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";
import { TreeViewDomainError, TREE_VIEW_ERROR_CODES } from "../errors/tree-view.errors";

// Khởi tạo lazy singleton ELK instance với bundled engine
let elkInstance: ELKInterface | null = null;

function getElkInstance(): ELKInterface {
  if (!elkInstance) {
    const ElkClass =
      (ELKConstructor as unknown as { default?: typeof ELKConstructor })?.default || ELKConstructor;
    elkInstance = new ElkClass();
  }
  return elkInstance;
}

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
    layoutOptions: n.layoutOptions,
    ports: n.ports?.map((p) => ({
      id: p.id,
      properties: {
        "port.side": p.side,
      },
    })),
  }));

  const elkEdges: ElkExtendedEdge[] = graph.edges.map((e) => {
    const isUnionMember = e.type === "union-member";
    return {
      id: e.id,
      sources: [e.sourcePort || e.source],
      targets: [e.targetPort || e.target],
      layoutOptions: isUnionMember
        ? {
            "elk.layered.priority.direction": "0",
          }
        : undefined,
    };
  });

  const elkRootNode: ElkNode = {
    id: graph.id,
    layoutOptions: options,
    children: elkChildren,
    edges: elkEdges,
  };

  try {
    // 2. Thực thi tính toán layout bất đồng bộ
    const elk = getElkInstance();
    const layouted = await elk.layout(elkRootNode);

    // 3. Phân nhóm các PersonNode theo Thế hệ (Generation Partition / Y-level)
    const generationHeight =
      TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT + TREE_LAYOUT_CONFIG.LAYER_SPACING;
    const unionVerticalOffset =
      (TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT - TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT) / 2;
    const nodeSpacing = TREE_LAYOUT_CONFIG.NODE_SPACING;

    const personNodesByPartition = new Map<
      number,
      { original: (typeof graph.nodes)[0]; x: number; y: number }[]
    >();
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

    for (const child of (layouted.children as ElkNode[]) || []) {
      const originalNode = nodeMap.get(child.id);
      if (!originalNode || originalNode.type !== "person") continue;

      const partitionStr = originalNode.layoutOptions?.["elk.partitioning.partition"];
      const partition =
        partitionStr !== undefined && !isNaN(parseInt(partitionStr, 10))
          ? parseInt(partitionStr, 10)
          : undefined;

      const alignedY = partition !== undefined ? partition * generationHeight : (child.y ?? 0);

      const partitionKey =
        partition !== undefined ? partition : Math.round(alignedY / generationHeight);

      const list = personNodesByPartition.get(partitionKey) || [];
      list.push({
        original: originalNode,
        x: child.x ?? 0,
        y: alignedY,
      });
      personNodesByPartition.set(partitionKey, list);
    }

    // 4. Xác định quan hệ phối ngẫu trong cùng thế hệ (từ graph.spousePairs và các cạnh union-member)
    const spousePairMap = new Map<string, string>(); // primaryId -> spouseId
    const spouseOfMap = new Map<string, string>(); // spouseId -> primaryId

    if (graph.spousePairs) {
      for (const pair of graph.spousePairs) {
        spousePairMap.set(pair.person1Id, pair.person2Id);
        spouseOfMap.set(pair.person2Id, pair.person1Id);
      }
    }

    for (const edge of graph.edges) {
      if (edge.type === "union-member") {
        spousePairMap.set(edge.source, edge.target);
        spouseOfMap.set(edge.target, edge.source);
      }
    }

    // 5. Chuẩn hóa vị trí X cho từng thế hệ: Căn giữa con cái dưới cha mẹ, giữ vợ chồng liền kề và không chồng lấn
    const childToParentsMap = new Map<string, string[]>();
    for (const edge of graph.edges) {
      if (edge.type === "parent-child") {
        const list = childToParentsMap.get(edge.target) || [];
        list.push(edge.source);
        childToParentsMap.set(edge.target, list);
      }
    }

    const personPosMap = new Map<string, { x: number; y: number; width: number }>();
    const sortedPartitions = Array.from(personNodesByPartition.keys()).sort((a, b) => a - b);

    for (const partitionKey of sortedPartitions) {
      const genNodes = personNodesByPartition.get(partitionKey) || [];

      // Sắp xếp theo X ban đầu từ ELK
      genNodes.sort((a, b) => a.x - b.x);

      // Gom cụm: Người phối ngẫu luôn đi ngay sau người bạn đời
      const orderedGenNodes: typeof genNodes = [];
      const visited = new Set<string>();

      for (const item of genNodes) {
        if (visited.has(item.original.id)) continue;

        // Nếu item này là người phối ngẫu của ai đó trong cùng gen mà người đó chưa được duyệt, đợi duyệt người kia trước
        const primaryId = spouseOfMap.get(item.original.id);
        if (
          primaryId &&
          genNodes.some((n) => n.original.id === primaryId) &&
          !visited.has(primaryId)
        ) {
          continue;
        }

        visited.add(item.original.id);
        orderedGenNodes.push(item);

        const spouseId = spousePairMap.get(item.original.id);
        if (spouseId && !visited.has(spouseId)) {
          const spouseItem = genNodes.find((n) => n.original.id === spouseId);
          if (spouseItem) {
            visited.add(spouseId);
            orderedGenNodes.push(spouseItem);
          }
        }
      }

      // Đưa nốt các node còn lại nếu có
      for (const item of genNodes) {
        if (!visited.has(item.original.id)) {
          visited.add(item.original.id);
          orderedGenNodes.push(item);
        }
      }

      // Gom nhóm anh chị em cùng cha mẹ (Sibling Groups) để căn giữa so với cha mẹ
      const siblingGroups: (typeof genNodes)[] = [];
      let currentGroup: typeof genNodes = [];

      const getParentKey = (nodeId: string) => {
        const parents = (childToParentsMap.get(nodeId) || []).slice().sort();
        return parents.join(",");
      };

      for (let i = 0; i < orderedGenNodes.length; i++) {
        const item = orderedGenNodes[i];
        const isSpouseOfPrev =
          i > 0 && spousePairMap.get(orderedGenNodes[i - 1].original.id) === item.original.id;
        const pKey = getParentKey(item.original.id);

        if (currentGroup.length === 0) {
          currentGroup.push(item);
        } else {
          const prevItem = currentGroup[currentGroup.length - 1];
          const prevKey = getParentKey(prevItem.original.id);
          if (isSpouseOfPrev || (pKey && pKey === prevKey)) {
            currentGroup.push(item);
          } else {
            siblingGroups.push(currentGroup);
            currentGroup = [item];
          }
        }
      }
      if (currentGroup.length > 0) {
        siblingGroups.push(currentGroup);
      }

      // Phân bố vị trí X cho từng nhóm, căn giữa dưới cha mẹ nếu có
      let nextAvailableX = orderedGenNodes[0]?.x ?? 0;
      let hasPositionedAny = false;

      for (const group of siblingGroups) {
        const firstChild = group[0];
        const parents = childToParentsMap.get(firstChild.original.id) || [];
        const positionedParents = parents
          .map((pId) => personPosMap.get(pId))
          .filter((p): p is { x: number; y: number; width: number } => p !== undefined);

        let idealGroupX: number | null = null;
        if (positionedParents.length > 0) {
          const minParentX = Math.min(...positionedParents.map((p) => p.x));
          const maxParentX = Math.max(...positionedParents.map((p) => p.x + p.width));
          const parentCenter = (minParentX + maxParentX) / 2;

          let groupWidth = 0;
          for (let k = 0; k < group.length; k++) {
            groupWidth += group[k].original.width;
            if (k > 0) groupWidth += nodeSpacing;
          }
          idealGroupX = parentCenter - groupWidth / 2;
        }

        for (let k = 0; k < group.length; k++) {
          const item = group[k];
          let itemX: number;

          if (k === 0) {
            if (idealGroupX !== null) {
              itemX = hasPositionedAny ? Math.max(idealGroupX, nextAvailableX) : idealGroupX;
            } else {
              itemX = hasPositionedAny ? Math.max(item.x, nextAvailableX) : item.x;
            }
          } else {
            const prevItem = group[k - 1];
            itemX = prevItem.x + prevItem.original.width + nodeSpacing;
          }

          item.x = itemX;
          personPosMap.set(item.original.id, {
            x: item.x,
            y: item.y,
            width: item.original.width,
          });

          nextAvailableX = item.x + item.original.width + nodeSpacing;
          hasPositionedAny = true;
        }
      }
    }

    // 6. Xây dựng danh sách PositionedNode hoàn chỉnh (PersonNodes + UnionNodes căn giữa)
    const positionedNodes: PositionedNode[] = [];

    // 6.1. Thêm PersonNodes đã chuẩn hóa
    for (const [, genNodes] of personNodesByPartition.entries()) {
      for (const item of genNodes) {
        positionedNodes.push({
          ...item.original,
          x: item.x,
          y: item.y,
        });
      }
    }

    // 6.2. Thêm UnionNodes được căn giữa hoàn hảo
    for (const origNode of graph.nodes) {
      if (origNode.type !== "union") continue;

      const partitionStr = origNode.layoutOptions?.["elk.partitioning.partition"];
      const partition =
        partitionStr !== undefined && !isNaN(parseInt(partitionStr, 10))
          ? parseInt(partitionStr, 10)
          : undefined;

      const fallbackChild = (layouted.children as ElkNode[])?.find((c) => c.id === origNode.id);
      const defaultY =
        partition !== undefined
          ? partition * generationHeight + unionVerticalOffset
          : (fallbackChild?.y ?? 0);

      const relatedMemberIds = graph.edges
        .filter(
          (e) => e.type === "union-member" && (e.target === origNode.id || e.source === origNode.id)
        )
        .map((e) => (e.target === origNode.id ? e.source : e.target));

      let centeredX = fallbackChild?.x ?? 0;
      let centeredY = defaultY;

      if (relatedMemberIds.length >= 2) {
        const m1 = personPosMap.get(relatedMemberIds[0]);
        const m2 = personPosMap.get(relatedMemberIds[1]);

        if (m1 && m2) {
          const leftMember = m1.x < m2.x ? m1 : m2;
          const rightMember = m1.x < m2.x ? m2 : m1;
          const leftEdge = leftMember.x + leftMember.width;
          const rightEdge = rightMember.x;

          centeredX = (leftEdge + rightEdge) / 2 - origNode.width / 2;
          centeredY = leftMember.y + unionVerticalOffset;
        }
      } else if (relatedMemberIds.length === 1) {
        const m1 = personPosMap.get(relatedMemberIds[0]);
        if (m1) {
          centeredX = m1.x + m1.width + 16;
          centeredY = m1.y + unionVerticalOffset;
        }
      }

      positionedNodes.push({
        ...origNode,
        x: centeredX,
        y: centeredY,
      });
    }

    const positionedEdges: PositionedEdge[] = ((layouted.edges as ElkExtendedEdge[]) || []).map(
      (edge: ElkExtendedEdge) => {
        const originalEdge = graph.edges.find((e) => e.id === edge.id)!;
        const sections = (edge.sections || []).map((sec: any) => ({
          startPoint: { x: sec.startPoint.x, y: sec.startPoint.y },
          endPoint: { x: sec.endPoint.x, y: sec.endPoint.y },
          bendPoints: sec.bendPoints?.map((bp: any) => ({ x: bp.x, y: bp.y })),
        }));

        return {
          ...originalEdge,
          sections,
        };
      }
    );

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
