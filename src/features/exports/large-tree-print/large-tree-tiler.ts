export interface PrintTile {
  pageNumber: number;
  row: number;
  col: number;
  viewBox: { x: number; y: number; width: number; height: number };
}

export interface TreeCanvasDimensions {
  totalWidth: number;
  totalHeight: number;
  pageWidth: number;
  pageHeight: number;
  overlapPx?: number;
}

/**
 * Phân mảnh đồ thị cây lớn thành các trang in phân tầng (Tiled Grid - P27-T17)
 */
export function calculatePrintTiles(dimensions: TreeCanvasDimensions): PrintTile[] {
  const { totalWidth, totalHeight, pageWidth, pageHeight, overlapPx = 20 } = dimensions;

  const effectiveWidth = Math.max(100, pageWidth - overlapPx);
  const effectiveHeight = Math.max(100, pageHeight - overlapPx);

  const cols = Math.ceil(totalWidth / effectiveWidth);
  const rows = Math.ceil(totalHeight / effectiveHeight);

  const tiles: PrintTile[] = [];
  let pageNumber = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push({
        pageNumber: pageNumber++,
        row: r + 1,
        col: c + 1,
        viewBox: {
          x: c * effectiveWidth,
          y: r * effectiveHeight,
          width: pageWidth,
          height: pageHeight,
        },
      });
    }
  }

  return tiles;
}
