import React, { memo } from "react";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { ReactFlowParentChildEdge } from "../types/tree-presentation.types";

export const ParentChildEdge = memo(function ParentChildEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<ReactFlowParentChildEdge>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const isAdoptive = data?.relationshipKind === "adoptive" || data?.relationshipKind === "foster";
  const isUnverified =
    data?.verificationStatus === "unverified" || data?.verificationStatus === "disputed";

  let strokeColor = "#059669"; // emerald-600
  let strokeDasharray: string | undefined = undefined;

  if (isUnverified) {
    strokeColor = "#d97706"; // amber-600
    strokeDasharray = "5,5";
  } else if (isAdoptive) {
    strokeColor = "#0284c7"; // sky-600
    strokeDasharray = "4,4";
  }

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: strokeColor,
        strokeWidth: 2,
        strokeDasharray,
      }}
    />
  );
});
