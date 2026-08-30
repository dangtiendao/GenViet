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
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const isInitialLoadRef = useRef(true);

  // Chỉ fitView duy nhất một lần khi nạp cây lần đầu tiên
  useEffect(() => {
    if (!positionedGraph || positionedGraph.nodes.length === 0) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      // Khởi tạo: Fit toàn bộ cây với độ phóng to trực quan
      fitView({
        padding: 0.15,
        minZoom: TREE_LAYOUT_CONFIG.MIN_ZOOM,
        maxZoom: 1.1,
        duration: 300,
      });
    }
  }, [positionedGraph, fitView]);

  const handleFitView = useCallback(() => {
    fitView({
      padding: 0.15,
      minZoom: TREE_LAYOUT_CONFIG.MIN_ZOOM,
      maxZoom: TREE_LAYOUT_CONFIG.MAX_ZOOM,
      duration: 300,
    });
  }, [fitView]);

  // Giữ nguyên vị trí UI, không tự động focus/pan viewport khi thu gọn/mở rộng
  const snapshotCenterPosition = useCallback(() => {
    // Không làm thay đổi viewport của người dùng
  }, []);

  return {
    zoomIn: () => zoomIn({ duration: 200 }),
    zoomOut: () => zoomOut({ duration: 200 }),
    fitView: handleFitView,
    snapshotCenterPosition,
  };
}
