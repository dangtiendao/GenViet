"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { PersonNode } from "./person-node";
import { UnionNode } from "./union-node";
import { ParentChildEdge } from "./parent-child-edge";
import { UnionEdge } from "./union-edge";
import { TreeControls } from "./tree-controls";
import type { ReactFlowTreeNode, ReactFlowTreeEdge } from "../types/tree-presentation.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

// Khai báo nodeTypes và edgeTypes tĩnh ngoài component để đảm bảo tính ổn định tuyệt đối
const STATIC_NODE_TYPES: NodeTypes = {
  person: PersonNode,
  union: UnionNode,
};

const STATIC_EDGE_TYPES: EdgeTypes = {
  "parent-child": ParentChildEdge,
  "union-member": UnionEdge,
};

export interface FamilyTreeCanvasProps {
  nodes: ReactFlowTreeNode[];
  edges: ReactFlowTreeEdge[];
  onPaneClick?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  onToggleFullscreen: () => void;
}

export function FamilyTreeCanvas({
  nodes,
  edges,
  onPaneClick,
  onZoomIn,
  onZoomOut,
  onFitView,
  isFullscreen,
  isFullscreenSupported,
  onToggleFullscreen,
}: FamilyTreeCanvasProps) {
  const nodeTypes = useMemo(() => STATIC_NODE_TYPES, []);
  const edgeTypes = useMemo(() => STATIC_EDGE_TYPES, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-50/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={onPaneClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        deleteKeyCode={null}
        minZoom={TREE_LAYOUT_CONFIG.MIN_ZOOM}
        maxZoom={TREE_LAYOUT_CONFIG.MAX_ZOOM}
        defaultViewport={{ x: 0, y: 0, zoom: TREE_LAYOUT_CONFIG.DEFAULT_ZOOM }}
        proOptions={{ hideAttribution: true }}
        className="h-full w-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
      </ReactFlow>

      {/* Floating Viewport Controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <TreeControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onFitView={onFitView}
          isFullscreen={isFullscreen}
          isFullscreenSupported={isFullscreenSupported}
          onToggleFullscreen={onToggleFullscreen}
        />
      </div>
    </div>
  );
}
