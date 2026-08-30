export interface LargeTreeExportConfig {
  maxNodes: number;
  maxPages: number;
  format: "pdf_tiled" | "poster_single";
  pageSize: "A4" | "A3" | "A0";
  includeLegend: boolean;
}

export const DEFAULT_LARGE_TREE_CONFIG: LargeTreeExportConfig = {
  maxNodes: 1000,
  maxPages: 40,
  format: "pdf_tiled",
  pageSize: "A4",
  includeLegend: true,
};
