import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";

/**
 * Cấu hình ELK.js Layered Layout Options tập trung
 */
export const DEFAULT_ELK_LAYOUT_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": TREE_LAYOUT_CONFIG.DEFAULT_DIRECTION,
  "elk.portConstraints": "FIXED_SIDE",
  "elk.partitioning.activate": "true",
  "elk.spacing.nodeNode": String(TREE_LAYOUT_CONFIG.NODE_SPACING),
  "elk.layered.spacing.nodeNodeBetweenLayers": String(TREE_LAYOUT_CONFIG.LAYER_SPACING),

  "elk.layered.spacing.edgeNodeBetweenLayers": "25",
  "elk.layered.spacing.edgeEdgeBetweenLayers": "15",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.unnecessaryBendpoints": "false",
};
