"use client";

import { useRef, useCallback, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import type { PositionedLayoutGraph } from "../layout/layout-graph.types";
import { calculateAnchoredViewport } from "../layout/viewport-anchor";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

export function useTreeViewport(
  centerPersonId: string | null,
  positionedGraph: PositionedLayoutGraph | null
) {
  const { zoomIn, zoomOut, fitView, setViewport, getViewport, getNode } = useReactFlow();

  const prevCenterPosRef = useRef<{ x: number; y: number } | null>(null);
  const isInitialLoadRef = useRef(true);

  // Lưu tọa độ của Center Person trước khi layout thay đổi
  const snapshotCenterPosition = useCallback(() => {
    if (!centerPersonId) return;
    const node = getNode(centerPersonId);
    if (node) {
      prevCenterPosRef.current = { x: node.position.x, y: node.position.y };
    }
  }, [centerPersonId, getNode]);

  // Sau khi positionedGraph hoàn tất, thực hiện Center Anchoring hoặc Initial Fit View
  useEffect(() => {
    if (!positionedGraph || positionedGraph.nodes.length === 0) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      // Khởi tạo: Fit toàn bộ cây
      fitView({
        padding: TREE_LAYOUT_CONFIG.FIT_VIEW_PADDING,
        minZoom: TREE_LAYOUT_CONFIG.MIN_ZOOM,
        maxZoom: TREE_LAYOUT_CONFIG.DEFAULT_ZOOM,
        duration: 300,
      });
      return;
    }

    if (centerPersonId && prevCenterPosRef.current) {
      const newCenterNode = positionedGraph.nodes.find((n) => n.id === centerPersonId);
      if (newCenterNode) {
        const currentViewport = getViewport();
        const anchored = calculateAnchoredViewport(prevCenterPosRef.current, currentViewport, {
          x: newCenterNode.x,
          y: newCenterNode.y,
        });

        setViewport(anchored, { duration: 250 });
        prevCenterPosRef.current = null;
      }
    }
  }, [positionedGraph, centerPersonId, fitView, getViewport, setViewport]);

  const handleFitView = useCallback(() => {
    fitView({
      padding: TREE_LAYOUT_CONFIG.FIT_VIEW_PADDING,
      minZoom: TREE_LAYOUT_CONFIG.MIN_ZOOM,
      maxZoom: TREE_LAYOUT_CONFIG.MAX_ZOOM,
      duration: 300,
    });
  }, [fitView]);

  return {
    zoomIn: () => zoomIn({ duration: 200 }),
    zoomOut: () => zoomOut({ duration: 200 }),
    fitView: handleFitView,
    snapshotCenterPosition,
  };
}
