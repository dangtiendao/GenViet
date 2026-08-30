"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import { TreeViewDomainError, TREE_VIEW_ERROR_CODES } from "../errors/tree-view.errors";

export interface UseTreeGraphParams {
  treeId: string;
  centerPersonId: string;
  ancestorDepth: number;
  descendantDepth: number;
  includeSpouses?: boolean;
  includeUnverified?: boolean;
  fullTree?: boolean;
}

export function useTreeGraph(params: UseTreeGraphParams) {
  const [data, setData] = useState<TreeGraphDto | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(params.treeId && params.centerPersonId));
  const [error, setError] = useState<TreeViewDomainError | null>(null);
  const reqSeqRef = useRef(0);

  const fetchGraph = useCallback(async () => {
    if (!params.treeId || !params.centerPersonId) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    const seq = ++reqSeqRef.current;
    setIsLoading(true);
    setError(null);

    const searchParams = new URLSearchParams({
      centerPersonId: params.centerPersonId,
      ancestorDepth: String(params.ancestorDepth),
      descendantDepth: String(params.descendantDepth),
      includeSpouses: String(params.includeSpouses ?? true),
      includeUnverified: String(params.includeUnverified ?? true),
      fullTree: String(params.fullTree ?? false),
    });

    try {
      const res = await fetch(`/api/trees/${params.treeId}/graph?${searchParams.toString()}`, {
        cache: "no-store",
      });

      const body = await res.json();

      // Tránh áp dụng kết quả stale nếu có request mới hơn
      if (seq !== reqSeqRef.current) return;

      if (!res.ok || !body.success) {
        const errCode = body?.error?.code;
        if (errCode === "TREE_GRAPH_TOO_LARGE") {
          throw new TreeViewDomainError(TREE_VIEW_ERROR_CODES.GRAPH_TOO_LARGE);
        }
        if (errCode === "TREE_GRAPH_CENTER_NOT_FOUND" || errCode === "TREE_GRAPH_CENTER_DELETED") {
          throw new TreeViewDomainError(TREE_VIEW_ERROR_CODES.CENTER_NOT_FOUND);
        }
        if (errCode === "TREE_GRAPH_FORBIDDEN") {
          throw new TreeViewDomainError(TREE_VIEW_ERROR_CODES.CENTER_FORBIDDEN);
        }
        throw new TreeViewDomainError(
          TREE_VIEW_ERROR_CODES.GRAPH_LOAD_FAILED,
          body?.error?.message || "Không thể tải dữ liệu sơ đồ cây."
        );
      }

      setData(body.data as TreeGraphDto);
    } catch (err) {
      if (seq !== reqSeqRef.current) return;
      if (err instanceof TreeViewDomainError) {
        setError(err);
      } else {
        setError(new TreeViewDomainError(TREE_VIEW_ERROR_CODES.GRAPH_LOAD_FAILED));
      }
    } finally {
      if (seq === reqSeqRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    params.treeId,
    params.centerPersonId,
    params.ancestorDepth,
    params.descendantDepth,
    params.includeSpouses,
    params.includeUnverified,
    params.fullTree,
  ]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return { data, isLoading, error, refetch: fetchGraph };
}
