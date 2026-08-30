import { describe, it, expect } from "vitest";
import { calculateAnchoredViewport } from "@/features/tree-view/layout/viewport-anchor";

describe("Viewport Anchor Tests (P15-T22)", () => {
  it("tính toán viewport dịch chuyển chính xác để giữ Center Person cố định trên màn hình", () => {
    // Tọa độ node ban đầu: (100, 200), Viewport ban đầu: (x: 50, y: 50, zoom: 1)
    // Tọa độ màn hình: 50 + 100*1 = 150 (X), 50 + 200*1 = 250 (Y)
    const prevCenterPos = { x: 100, y: 200 };
    const prevViewport = { x: 50, y: 50, zoom: 1 };

    // Sau khi mở rộng tổ tiên, Center node bị đẩy xuống tọa độ mới: (150, 350)
    const newCenterPos = { x: 150, y: 350 };

    const newViewport = calculateAnchoredViewport(prevCenterPos, prevViewport, newCenterPos);

    // Viewport mới cần dịch chuyển:
    // newX = 150 - 150*1 = 0
    // newY = 250 - 350*1 = -100
    expect(newViewport.x).toBe(0);
    expect(newViewport.y).toBe(-100);
    expect(newViewport.zoom).toBe(1);

    // Kiểm tra tọa độ màn hình mới:
    const newScreenX = newViewport.x + newCenterPos.x * newViewport.zoom;
    const newScreenY = newViewport.y + newCenterPos.y * newViewport.zoom;

    expect(newScreenX).toBe(150);
    expect(newScreenY).toBe(250);
  });

  it("trả về nguyên trạng viewport cũ nếu thiếu tọa độ Center Node", () => {
    const prevViewport = { x: 100, y: 100, zoom: 1.5 };
    const result = calculateAnchoredViewport(null, prevViewport, { x: 200, y: 200 });
    expect(result).toEqual(prevViewport);
  });
});
