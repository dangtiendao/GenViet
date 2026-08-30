import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ReactFlowUnionNode } from "../types/tree-presentation.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

export const UnionNode = memo(
  function UnionNode({ data }: NodeProps<ReactFlowUnionNode>) {
    return (
      <div
        style={{
          width: TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH,
          height: TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT,
        }}
        className="pointer-events-none relative opacity-0"
        aria-hidden="true"
      >
        <Handle
          type="target"
          position={Position.Top}
          id={`${data.unionId}-north`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${data.unionId}-south`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="target"
          position={Position.Left}
          id={`${data.unionId}-west`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="target"
          position={Position.Right}
          id={`${data.unionId}-east`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.data.unionId === next.data.unionId &&
      prev.data.treeId === next.data.treeId &&
      prev.data.status === next.data.status
    );
  }
);
