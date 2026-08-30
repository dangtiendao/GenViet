"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useTreeGraph } from "../hooks/use-tree-graph";
import { useTreeLayout } from "../hooks/use-tree-layout";
import { useTreeSelection } from "../hooks/use-tree-selection";
import { useTreeExpansion } from "../hooks/use-tree-expansion";
import { useTreeViewport } from "../hooks/use-tree-viewport";
import { useFullscreen } from "../hooks/use-fullscreen";
import { mapLayoutToReactFlow } from "../layout/presentation-mapper";
import { FamilyTreeCanvas } from "./family-tree-canvas";
import { TreeToolbar } from "./tree-toolbar";
import { TreeLoadingState } from "./tree-loading-state";
import { TreeEmptyState } from "./tree-empty-state";
import { TreeErrorState } from "./tree-error-state";
import { PersonDetailSheet } from "./person-detail-sheet";
import { PersonDetailPanel } from "./person-detail-panel";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface FamilyTreeClientProps {
  treeId: string;
  initialCenterPersonId: string | null;
  canWrite?: boolean;
}

function FamilyTreeCanvasInternal({
  treeId,
  initialCenterPersonId,
  canWrite = false,
}: FamilyTreeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 1. Quản lý Center Person
  const [centerPersonId, setCenterPersonId] = useState<string | null>(initialCenterPersonId);

  // 2. Quản lý Mở rộng / Thu gọn nhánh
  const {
    ancestorDepth,
    descendantDepth,
    collapsedPersonIds,
    expandAncestors,
    expandDescendants,
    toggleCollapse,
    resetExpansion,
  } = useTreeExpansion(2, 2);

  // 3. Tải dữ liệu DTO từ API P14
  const {
    data: dto,
    isLoading: isGraphLoading,
    error: graphError,
    refetch,
  } = useTreeGraph({
    treeId,
    centerPersonId: centerPersonId || "",
    ancestorDepth,
    descendantDepth,
    includeSpouses: true,
    includeUnverified: true,
  });

  // 4. Bố cục không gian ELK (Chỉ chạy khi cấu trúc thay đổi)
  const { positionedGraph, isLayouting, layoutError } = useTreeLayout(dto, collapsedPersonIds);

  // 5. Điều khiển Viewport & Center Anchoring
  const { zoomIn, zoomOut, fitView, snapshotCenterPosition } = useTreeViewport(
    centerPersonId,
    positionedGraph
  );

  // 6. Quản lý Toàn màn hình
  const {
    isFullscreen,
    isSupported: isFullscreenSupported,
    toggleFullscreen,
  } = useFullscreen(containerRef);

  // 7. Quản lý Chọn nhân vật & Chi tiết
  const { selectedPersonId, isDetailOpen, selectPerson, closeDetail } = useTreeSelection();

  // Thao tác đổi Center Person
  const handleChangeCenter = useCallback(
    (newCenterId: string) => {
      snapshotCenterPosition();
      setCenterPersonId(newCenterId);
    },
    [snapshotCenterPosition]
  );

  // Thao tác mở rộng tổ tiên / hậu duệ kèm snapshot tọa độ
  const handleExpandAncestors = useCallback(() => {
    snapshotCenterPosition();
    expandAncestors();
  }, [snapshotCenterPosition, expandAncestors]);

  const handleExpandDescendants = useCallback(() => {
    snapshotCenterPosition();
    expandDescendants();
  }, [snapshotCenterPosition, expandDescendants]);

  // Ánh xạ sang React Flow Nodes/Edges
  const { nodes, edges } = useMemo(() => {
    if (!positionedGraph || !dto) return { nodes: [], edges: [] };

    return mapLayoutToReactFlow(positionedGraph, dto, {
      selectedPersonId,
      collapsedPersonIds,
      treeId,
      canWrite,
      onSelect: (pId) => selectPerson(pId),
      onExpandAncestors: () => handleExpandAncestors(),
      onExpandDescendants: () => handleExpandDescendants(),
      onToggleCollapse: (pId) => toggleCollapse(pId),
      onChangeCenter: (pId) => handleChangeCenter(pId),
    });
  }, [
    positionedGraph,
    dto,
    selectedPersonId,
    collapsedPersonIds,
    treeId,
    canWrite,
    selectPerson,
    handleExpandAncestors,
    handleExpandDescendants,
    toggleCollapse,
    handleChangeCenter,
  ]);

  // Tìm selectedPerson và centerPerson trong DTO
  const selectedPerson = useMemo(() => {
    if (!dto || !selectedPersonId) return null;
    return dto.persons.find((p) => p.id === selectedPersonId) || null;
  }, [dto, selectedPersonId]);

  const centerPerson = useMemo(() => {
    if (!dto || !centerPersonId) return null;
    return dto.persons.find((p) => p.id === centerPersonId) || null;
  }, [dto, centerPersonId]);

  if (!centerPersonId && !isGraphLoading) {
    return <TreeEmptyState treeId={treeId} canWrite={canWrite} />;
  }

  if (graphError) {
    return <TreeErrorState error={graphError} onRetry={refetch} />;
  }

  if (layoutError) {
    return <TreeErrorState error={layoutError} onRetry={refetch} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen rounded-none border-0"
          : "h-[calc(100vh-12rem)] min-h-[500px] w-full"
      }`}
    >
      {/* Thanh công cụ đỉnh */}
      <TreeToolbar
        treeId={treeId}
        centerPerson={centerPerson}
        ancestorDepth={ancestorDepth}
        descendantDepth={descendantDepth}
        isTruncated={dto?.truncated}
        onResetExpansion={resetExpansion}
      />

      {/* Vùng Canvas React Flow */}
      <div className="relative flex-1">
        {isGraphLoading && !dto ? (
          <TreeLoadingState message="Đang tải dữ liệu lát cắt cây gia phả..." />
        ) : isLayouting && !positionedGraph ? (
          <TreeLoadingState message="Đang tính toán bố cục không gian phân tầng..." />
        ) : (
          <FamilyTreeCanvas
            nodes={nodes}
            edges={edges}
            onPaneClick={() => selectPerson(null)}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFitView={fitView}
            isFullscreen={isFullscreen}
            isFullscreenSupported={isFullscreenSupported}
            onToggleFullscreen={toggleFullscreen}
          />
        )}

        {/* Desktop Side Panel */}
        {!isMobile && (
          <PersonDetailPanel
            person={selectedPerson}
            isOpen={isDetailOpen}
            treeId={treeId}
            isCenter={selectedPerson?.id === centerPersonId}
            onClose={closeDetail}
            onChangeCenter={handleChangeCenter}
          />
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobile && (
        <PersonDetailSheet
          person={selectedPerson}
          isOpen={isDetailOpen}
          treeId={treeId}
          isCenter={selectedPerson?.id === centerPersonId}
          onClose={closeDetail}
          onChangeCenter={handleChangeCenter}
        />
      )}
    </div>
  );
}

export function FamilyTreeClient(props: FamilyTreeClientProps) {
  return (
    <ReactFlowProvider>
      <FamilyTreeCanvasInternal {...props} />
    </ReactFlowProvider>
  );
}
