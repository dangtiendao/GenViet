"use client";

import { useState, useCallback } from "react";
import { TREE_GRAPH_LIMITS } from "@/features/tree-graph/schemas/tree-graph-query.schema";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

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

  const toggleCollapse = useCallback((personId: string) => {
    setCollapsedPersonIds((prev) => {
      const next = new Set(prev);
      if (next.has(personId)) {
        next.delete(personId);
      } else {
        next.add(personId);
      }
      return next;
    });
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
    toggleCollapse,
    resetExpansion,
  };
}
