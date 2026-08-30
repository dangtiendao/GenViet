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
import { mergeTreeGraphDtos } from "../layout/graph-merge";
import { FamilyTreeCanvas } from "./family-tree-canvas";
import { TreeToolbar } from "./tree-toolbar";
import { TreeLoadingState } from "./tree-loading-state";
import { TreeEmptyState } from "./tree-empty-state";
import { TreeErrorState } from "./tree-error-state";
import { PersonDetailSheet } from "./person-detail-sheet";
import { PersonDetailPanel } from "./person-detail-panel";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

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

  // 1. Quản lý Center Person & Full Tree Mode
  const [centerPersonId, setCenterPersonId] = useState<string | null>(initialCenterPersonId);
  const [isFullTree, setIsFullTree] = useState(false);

  // 2. Quản lý Mở rộng / Thu gọn nhánh
  const {
    ancestorDepth,
    descendantDepth,
    collapsedPersonIds,
    expandAncestors,
    expandDescendants,
    expandFullTree,
    toggleCollapse,
    resetExpansion,
  } = useTreeExpansion(2, 2);

  // 3. Tải dữ liệu DTO từ API P14
  const {
    data: rawDto,
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
    fullTree: isFullTree,
  });

  // Tích lũy các lát cắt đồ thị để khi mở rộng đời sau/đời trước vẫn giữ nguyên vẹn toàn bộ cây
  const [accumulatedDto, setAccumulatedDto] = useState<TreeGraphDto | null>(null);

  React.useEffect(() => {
    if (rawDto) {
      setAccumulatedDto((prev) => (isFullTree ? rawDto : mergeTreeGraphDtos(prev, rawDto)));
    }
  }, [rawDto, isFullTree]);

  const activeDto = accumulatedDto || rawDto;

  // 4. Bố cục không gian ELK (Chỉ chạy khi cấu trúc thay đổi)
  const { positionedGraph, isLayouting, layoutError } = useTreeLayout(
    activeDto,
    collapsedPersonIds
  );

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
      setCenterPersonId(newCenterId);
      setIsFullTree(false);
      setAccumulatedDto(null);
      resetExpansion();
    },
    [resetExpansion]
  );

  // Thao tác mở rộng tổ tiên / hậu duệ (giữ nguyên viewport góc nhìn hiện tại)
  const handleExpandAncestors = useCallback(
    (targetPersonId?: string) => {
      if (targetPersonId && targetPersonId !== centerPersonId) {
        setCenterPersonId(targetPersonId);
      } else {
        expandAncestors();
      }
    },
    [centerPersonId, expandAncestors]
  );

  const handleExpandDescendants = useCallback(
    (targetPersonId?: string) => {
      if (targetPersonId && targetPersonId !== centerPersonId) {
        setCenterPersonId(targetPersonId);
      } else {
        expandDescendants();
      }
    },
    [centerPersonId, expandDescendants]
  );

  const handleResetExpansion = useCallback(() => {
    setIsFullTree(false);
    resetExpansion();
    setCenterPersonId(initialCenterPersonId);
    setAccumulatedDto(null);
  }, [resetExpansion, initialCenterPersonId]);

  const handleExpandFullTree = useCallback(() => {
    setIsFullTree(true);
    setAccumulatedDto(null);
    expandFullTree();
  }, [expandFullTree]);

  const handleReload = useCallback(() => {
    setAccumulatedDto(null);
    refetch();
  }, [refetch]);

  // Thao tác thu gọn / mở rộng nhánh: đồng bộ phối ngẫu và giữ nguyên viewport (không ghim tâm điểm)
  const handleToggleCollapse = useCallback(
    (pId: string) => {
      toggleCollapse(pId, activeDto);
    },
    [toggleCollapse, activeDto]
  );

  // Ánh xạ sang React Flow Nodes/Edges
  const { nodes, edges } = useMemo(() => {
    if (!positionedGraph || !activeDto) return { nodes: [], edges: [] };

    return mapLayoutToReactFlow(positionedGraph, activeDto, {
      selectedPersonId,
      collapsedPersonIds,
      treeId,
      canWrite,
      onSelect: (pId) => selectPerson(pId),
      onExpandAncestors: (pId) => handleExpandAncestors(pId),
      onExpandDescendants: (pId) => handleExpandDescendants(pId),
      onToggleCollapse: (pId) => handleToggleCollapse(pId),
      onChangeCenter: (pId) => handleChangeCenter(pId),
      onRefresh: () => handleReload(),
    });
  }, [
    positionedGraph,
    activeDto,
    selectedPersonId,
    collapsedPersonIds,
    treeId,
    canWrite,
    selectPerson,
    handleExpandAncestors,
    handleExpandDescendants,
    handleToggleCollapse,
    handleChangeCenter,

    handleReload,
  ]);

  // Tìm selectedPerson và centerPerson trong DTO
  const selectedPerson = useMemo(() => {
    if (!activeDto || !selectedPersonId) return null;
    return activeDto.persons.find((p) => p.id === selectedPersonId) || null;
  }, [activeDto, selectedPersonId]);

  const centerPerson = useMemo(() => {
    if (!activeDto || !centerPersonId) return null;
    return activeDto.persons.find((p) => p.id === centerPersonId) || null;
  }, [activeDto, centerPersonId]);

  if (!centerPersonId || (activeDto && activeDto.persons.length === 0)) {
    return <TreeEmptyState treeId={treeId} canWrite={canWrite} />;
  }

  if (graphError) {
    return <TreeErrorState error={graphError} onRetry={handleReload} />;
  }

  if (layoutError) {
    return <TreeErrorState error={layoutError} onRetry={handleReload} />;
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
        isTruncated={activeDto?.truncated}
        onResetExpansion={handleResetExpansion}
        onExpandFullTree={handleExpandFullTree}
        onReload={handleReload}
        isRefreshing={isGraphLoading}
      />

      {/* Vùng Canvas React Flow */}
      <div className="relative flex-1">
        {isGraphLoading && (!activeDto || isFullTree) ? (
          <TreeLoadingState
            message={
              isFullTree
                ? "Đang tải và dựng toàn bộ cây gia phả..."
                : "Đang tải dữ liệu lát cắt cây gia phả..."
            }
          />
        ) : isLayouting && !positionedGraph ? (
          <TreeLoadingState message="Đang tính toán bố cục không gian phân tầng..." />
        ) : (
          <>
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

            {/* Overlay loading mượt mà khi đang tải toàn bộ cây */}
            {(isGraphLoading || isLayouting) && (
              <div className="pointer-events-none absolute right-4 bottom-4 z-30 flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-emerald-800 shadow-md backdrop-blur-xs">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                <span>
                  {isFullTree ? "Đang dựng toàn bộ gia phả..." : "Đang cập nhật sơ đồ..."}
                </span>
              </div>
            )}
          </>
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
