import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TreeControls } from "@/features/tree-view/components/tree-controls";

describe("TreeControls Component Tests (P15-T13, P15-T15, P15-T16)", () => {
  it("render đầy đủ các nút Phóng to, Thu nhỏ, Khung nhìn toàn cảnh và Toàn màn hình", () => {
    const html = renderToStaticMarkup(
      <TreeControls
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onFitView={vi.fn()}
        isFullscreen={false}
        isFullscreenSupported={true}
        onToggleFullscreen={vi.fn()}
      />
    );

    expect(html).toContain("Phóng to");
    expect(html).toContain("Thu nhỏ");
    expect(html).toContain("Khung nhìn toàn cảnh (Fit View)");
    expect(html).toContain("Xem toàn màn hình");
  });

  it("render nút Thoát toàn màn hình khi isFullscreen = true", () => {
    const html = renderToStaticMarkup(
      <TreeControls
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onFitView={vi.fn()}
        isFullscreen={true}
        isFullscreenSupported={true}
        onToggleFullscreen={vi.fn()}
      />
    );

    expect(html).toContain("Thoát toàn màn hình");
  });
});
