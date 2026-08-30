"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";

export function useFullscreen(containerRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const doc = document as unknown as {
      fullscreenEnabled?: boolean;
      webkitFullscreenEnabled?: boolean;
      mozFullScreenEnabled?: boolean;
      msFullscreenEnabled?: boolean;
    };

    const supported = Boolean(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
    setIsSupported(supported);

    const handleFullscreenChange = () => {
      const docWithElement = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };

      const currentElement =
        docWithElement.fullscreenElement ||
        docWithElement.webkitFullscreenElement ||
        docWithElement.mozFullScreenElement ||
        docWithElement.msFullscreenElement;

      setIsFullscreen(Boolean(currentElement && currentElement === containerRef.current));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [containerRef]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current || typeof document === "undefined") return;

    try {
      if (!isFullscreen) {
        const elem = containerRef.current as unknown as {
          requestFullscreen?: () => Promise<void>;
          webkitRequestFullscreen?: () => Promise<void>;
          mozRequestFullScreen?: () => Promise<void>;
          msRequestFullscreen?: () => Promise<void>;
        };

        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        const doc = document as unknown as {
          exitFullscreen?: () => Promise<void>;
          webkitExitFullscreen?: () => Promise<void>;
          mozCancelFullScreen?: () => Promise<void>;
          msExitFullscreen?: () => Promise<void>;
        };

        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch {
      // Ignored if user blocked fullscreen permissions
    }
  }, [containerRef, isFullscreen]);

  return { isFullscreen, isSupported, toggleFullscreen };
}
