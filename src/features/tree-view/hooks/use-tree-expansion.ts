"use client";

import { useState, useCallback } from "react";
import { TREE_GRAPH_LIMITS } from "@/features/tree-graph/schemas/tree-graph-query.schema";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

/**
 * Thu thập tập hợp Person IDs cần đồng bộ trạng thái thu gọn / mở rộng (Bao gồm người được chọn và phối ngẫu cùng union)
 */
export function calculateTargetCollapseIds(
  personId: string,
  dto?: TreeGraphDto | null
): Set<string> {
  const targetIds = new Set<string>([personId]);

  if (dto && dto.unionMembers && dto.unionMembers.length > 0) {
    // Tìm các union mà personId tham gia
    const myUnionIds = new Set(
      dto.unionMembers.filter((m) => m.personId === personId).map((m) => m.unionId)
    );

    if (myUnionIds.size > 0) {
      // Tìm các phối ngẫu trong cùng union
      for (const member of dto.unionMembers) {
        if (myUnionIds.has(member.unionId) && member.personId !== personId) {
          targetIds.add(member.personId);
        }
      }
    }
  }

  return targetIds;
}

export function useTreeExpansion(initialAncestorDepth = 2, initialDescendantDepth = 2) {
  const [ancestorDepth, setAncestorDepth] = useState(initialAncestorDepth);
  const [descendantDepth, setDescendantDepth] = useState(initialDescendantDepth);
  const [collapsedPersonIds, setCollapsedPersonIds] = useState<Set<string>>(new Set());

  const expandAncestors = useCallback(() => {
    setAncestorDepth((prev) =>
      Math.min(prev + TREE_LAYOUT_CONFIG.EXPANSION_STEP, TREE_GRAPH_LIMITS.MAX_ANCESTOR_DEPTH)
    );
  }, []);

  const expandDescendants = useCallback(() => {
    setDescendantDepth((prev) =>
      Math.min(prev + TREE_LAYOUT_CONFIG.EXPANSION_STEP, TREE_GRAPH_LIMITS.MAX_DESCENDANT_DEPTH)
    );
  }, []);

  const toggleCollapse = useCallback((personId: string, dto?: TreeGraphDto | null) => {
    setCollapsedPersonIds((prev) => {
      const next = new Set(prev);
      const targetIds = calculateTargetCollapseIds(personId, dto);
      const isCurrentlyCollapsed = next.has(personId);

      for (const id of targetIds) {
        if (isCurrentlyCollapsed) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }

      return next;
    });
  }, []);

  const expandFullTree = useCallback(() => {
    setAncestorDepth(TREE_GRAPH_LIMITS.MAX_ANCESTOR_DEPTH);
    setDescendantDepth(TREE_GRAPH_LIMITS.MAX_DESCENDANT_DEPTH);
    setCollapsedPersonIds(new Set());
  }, []);

  const resetExpansion = useCallback(() => {
    setAncestorDepth(initialAncestorDepth);
    setDescendantDepth(initialDescendantDepth);
    setCollapsedPersonIds(new Set());
  }, [initialAncestorDepth, initialDescendantDepth]);

  return {
    ancestorDepth,
    descendantDepth,
    collapsedPersonIds,
    expandAncestors,
    expandDescendants,
    expandFullTree,
    toggleCollapse,
    resetExpansion,
  };
}
