import React, { memo } from "react";
import { BaseEdge, getStraightPath, type EdgeProps } from "@xyflow/react";
import type { ReactFlowUnionEdge } from "../types/tree-presentation.types";

export const UnionEdge = memo(function UnionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<ReactFlowUnionEdge>) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: "#c026d3", // fuchsia-600 (Màu tím hồng đặc trưng cho quan hệ hôn phối)
        strokeWidth: 2,
        strokeDasharray: "4,4",
      }}
    />
  );
});
