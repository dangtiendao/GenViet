"use client";

import React from "react";
import { Plus, Minus, Maximize, Minimize, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  onToggleFullscreen: () => void;
}

export function TreeControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  isFullscreen,
  isFullscreenSupported,
  onToggleFullscreen,
}: TreeControlsProps) {
  return (
    <div
      role="toolbar"
      aria-label="Thanh công cụ điều khiển sơ đồ cây"
      className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white/95 p-1.5 shadow-md backdrop-blur-xs"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        aria-label="Phóng to sơ đồ"
        title="Phóng to (+)"
        className="h-8 w-8 text-neutral-700 hover:bg-neutral-100"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        aria-label="Thu nhỏ sơ đồ"
        title="Thu nhỏ (-)"
        className="h-8 w-8 text-neutral-700 hover:bg-neutral-100"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onFitView}
        aria-label="Khung nhìn toàn cảnh (Fit View)"
        title="Toàn cảnh (Fit View)"
        className="h-8 w-8 text-neutral-700 hover:bg-neutral-100"
      >
        <Expand className="h-4 w-4" />
      </Button>

      {isFullscreenSupported && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
          title={isFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình"}
          className="h-8 w-8 text-neutral-700 hover:bg-neutral-100"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
