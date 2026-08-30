export interface GraphPersonNode {
  id: string;
  fullName: string;
  gender?: string;
}

export interface GraphEdge {
  fromId: string;
  toId: string;
  type: "parent" | "child" | "spouse";
}

export interface KinshipPathStep {
  fromPersonId: string;
  toPersonId: string;
  relationType: "parent" | "child" | "spouse";
  description: string;
}

export interface RelationshipPathResult {
  found: boolean;
  distance: number;
  steps: KinshipPathStep[];
  explanation: string;
}

/**
 * Tìm kiếm đường quan hệ phả hệ ngắn nhất giữa hai nhân vật (P27-T13)
 * Giới hạn độ sâu tối đa 10 thế hệ, chống lặp chu trình.
 */
export function findShortestKinshipPath(
  startPersonId: string,
  targetPersonId: string,
  persons: Record<string, GraphPersonNode>,
  edges: GraphEdge[],
  maxDepth: number = 10
): RelationshipPathResult {
  if (startPersonId === targetPersonId) {
    return {
      found: true,
      distance: 0,
      steps: [],
      explanation: "Hai đối tượng là cùng một người",
    };
  }

  // Xây dựng adjacency list
  const adj: Record<string, { toId: string; type: "parent" | "child" | "spouse" }[]> = {};
  for (const pId of Object.keys(persons)) {
    adj[pId] = [];
  }

  for (const e of edges) {
    if (!adj[e.fromId]) adj[e.fromId] = [];
    adj[e.fromId].push({ toId: e.toId, type: e.type });

    // Cạnh ngược
    if (!adj[e.toId]) adj[e.toId] = [];
    const reverseType = e.type === "parent" ? "child" : e.type === "child" ? "parent" : "spouse";
    adj[e.toId].push({ toId: e.fromId, type: reverseType });
  }

  const queue: { currentId: string; path: KinshipPathStep[]; depth: number }[] = [
    { currentId: startPersonId, path: [], depth: 0 },
  ];
  const visited = new Set<string>([startPersonId]);

  while (queue.length > 0) {
    const { currentId, path, depth } = queue.shift()!;

    if (currentId === targetPersonId) {
      const explanation = path.map((s) => s.description).join(" -> ");
      return {
        found: true,
        distance: path.length,
        steps: path,
        explanation,
      };
    }

    if (depth >= maxDepth) continue;

    const neighbors = adj[currentId] || [];
    for (const n of neighbors) {
      if (!visited.has(n.toId)) {
        visited.add(n.toId);
        const fromName = persons[currentId]?.fullName || currentId;
        const toName = persons[n.toId]?.fullName || n.toId;

        let desc = `${fromName} là `;
        if (n.type === "parent") desc += `cha/mẹ của ${toName}`;
        else if (n.type === "child") desc += `con của ${toName}`;
        else desc += `vợ/chồng của ${toName}`;

        const nextStep: KinshipPathStep = {
          fromPersonId: currentId,
          toPersonId: n.toId,
          relationType: n.type,
          description: desc,
        };

        queue.push({
          currentId: n.toId,
          path: [...path, nextStep],
          depth: depth + 1,
        });
      }
    }
  }

  return {
    found: false,
    distance: -1,
    steps: [],
    explanation: "Không tìm thấy đường quan hệ phả hệ trong phạm vi cho phép",
  };
}
