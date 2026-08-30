"use client";

import { useState, useEffect, useRef } from "react";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import type { PositionedLayoutGraph } from "../layout/layout-graph.types";
import { projectDtoToLayoutGraph } from "../layout/graph-projection";
import { calculateElkLayout } from "../layout/elk-layout-adapter";
import { TreeViewDomainError, TREE_VIEW_ERROR_CODES } from "../errors/tree-view.errors";

/**
 * Sinh layout fingerprint tất định chỉ dựa trên cấu trúc đồ thị hiển thị
 */
export function computeLayoutFingerprint(
  dto: TreeGraphDto | null,
  collapsedPersonIds: Set<string>
): string {
  if (!dto) return "";

  const personIds = dto.persons
    .map((p) => p.id)
    .sort()
    .join(",");
  const relIds = dto.parentChildRelationships
    .map((r) => r.id)
    .sort()
    .join(",");
  const unionIds = dto.unions
    .map((u) => u.id)
    .sort()
    .join(",");
  const collapsedIds = Array.from(collapsedPersonIds).sort().join(",");

  return `${dto.treeId}|P:${personIds}|R:${relIds}|U:${unionIds}|C:${collapsedIds}`;
}

export function useTreeLayout(
  dto: TreeGraphDto | null,
  collapsedPersonIds: Set<string> = new Set()
) {
  const [positionedGraph, setPositionedGraph] = useState<PositionedLayoutGraph | null>(null);
  const [isLayouting, setIsLayouting] = useState(false);
  const [layoutError, setLayoutError] = useState<TreeViewDomainError | null>(null);

  const lastFingerprintRef = useRef<string>("");
  const layoutSeqRef = useRef<number>(0);

  useEffect(() => {
    if (!dto || dto.persons.length === 0) {
      setPositionedGraph(null);
      return;
    }

    const currentFingerprint = computeLayoutFingerprint(dto, collapsedPersonIds);

    // Bỏ qua nếu cấu trúc đồ thị không hề thay đổi (VD: chỉ mở detail, đổi selection, hover)
    if (currentFingerprint === lastFingerprintRef.current && positionedGraph !== null) {
      return;
    }

    lastFingerprintRef.current = currentFingerprint;
    const seq = ++layoutSeqRef.current;
    setIsLayouting(true);
    setLayoutError(null);

    const layoutGraph = projectDtoToLayoutGraph(dto, collapsedPersonIds);

    calculateElkLayout(layoutGraph)
      .then((res) => {
        if (seq === layoutSeqRef.current) {
          setPositionedGraph(res);
          setIsLayouting(false);
        }
      })
      .catch((err) => {
        if (seq === layoutSeqRef.current) {
          setLayoutError(
            err instanceof TreeViewDomainError
              ? err
              : new TreeViewDomainError(TREE_VIEW_ERROR_CODES.LAYOUT_FAILED)
          );
          setIsLayouting(false);
        }
      });
  }, [dto, collapsedPersonIds, positionedGraph]);

  return { positionedGraph, isLayouting, layoutError };
}
