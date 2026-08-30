"use client";

import { useState, useEffect } from "react";
import type { PwaDisplayMode } from "../types/pwa.types";

export function useDisplayMode(): { displayMode: PwaDisplayMode; isStandalone: boolean } {
  const [displayMode, setDisplayMode] = useState<PwaDisplayMode>("browser");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDisplayMode = (): PwaDisplayMode => {
      // iOS Safari standalone check
      if ((navigator as any).standalone) {
        return "standalone";
      }
      if (window.matchMedia("(display-mode: standalone)").matches) {
        return "standalone";
      }
      if (window.matchMedia("(display-mode: minimal-ui)").matches) {
        return "minimal-ui";
      }
      if (window.matchMedia("(display-mode: fullscreen)").matches) {
        return "fullscreen";
      }
      return "browser";
    };

    setDisplayMode(checkDisplayMode());

    const matcher = window.matchMedia("(display-mode: standalone)");
    const handler = () => {
      setDisplayMode(checkDisplayMode());
    };

    if (matcher.addEventListener) {
      matcher.addEventListener("change", handler);
      return () => matcher.removeEventListener("change", handler);
    }
  }, []);

  return {
    displayMode,
    isStandalone: displayMode === "standalone" || displayMode === "fullscreen",
  };
}
