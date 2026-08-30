export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Tính toán Viewport mới nhằm giữ Center Person ở đúng vị trí thị giác trên màn hình
 * sau khi cấu trúc cây thay đổi (Expand, Collapse, Refetch)
 */
export function calculateAnchoredViewport(
  prevCenterNodePos: Point | null | undefined,
  prevViewport: Viewport,
  newCenterNodePos: Point | null | undefined
): Viewport {
  if (!prevCenterNodePos || !newCenterNodePos) {
    return prevViewport;
  }

  const zoom = prevViewport.zoom;

  // 1. Tính toán tọa độ màn hình (Screen/Canvas Pixel) của Center Person trước khi layout
  const prevScreenX = prevViewport.x + prevCenterNodePos.x * zoom;
  const prevScreenY = prevViewport.y + prevCenterNodePos.y * zoom;

  // 2. Tính toán Viewport (x, y) mới sao cho Center Person mới xuất hiện đúng tại tọa độ màn hình đó
  const newViewportX = prevScreenX - newCenterNodePos.x * zoom;
  const newViewportY = prevScreenY - newCenterNodePos.y * zoom;

  return {
    x: Math.round(newViewportX),
    y: Math.round(newViewportY),
    zoom,
  };
}
