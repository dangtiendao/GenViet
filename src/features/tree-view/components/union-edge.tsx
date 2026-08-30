import React, { memo } from "react";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { ReactFlowUnionEdge } from "../types/tree-presentation.types";

export const UnionEdge = memo(function UnionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps<ReactFlowUnionEdge>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 4,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: "#f43f5e", // rose-500
        strokeWidth: 2,
        strokeDasharray: "2,2",
      }}
    />
  );
});
