import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ReactFlowUnionNode } from "../types/tree-presentation.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

export const UnionNode = memo(function UnionNode({ data }: NodeProps<ReactFlowUnionNode>) {
  const isDivorced = data.status === "divorced" || data.status === "separated";

  return (
    <div
      style={{
        width: TREE_LAYOUT_CONFIG.UNION_NODE_WIDTH,
        height: TREE_LAYOUT_CONFIG.UNION_NODE_HEIGHT,
      }}
      className={`relative flex items-center justify-center rounded-full border shadow-2xs ${
        isDivorced
          ? "border-neutral-300 bg-neutral-100 text-neutral-400"
          : "border-rose-300 bg-rose-50 text-rose-500"
      }`}
      title={isDivorced ? "Hôn nhân đã chấm dứt" : "Quan hệ hôn phối"}
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
        type="source"
        position={Position.Right}
        id={`${data.unionId}-east`}
        className="!h-1 !w-1 !opacity-0"
        isConnectable={false}
      />

      <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
    </div>
  );
});
