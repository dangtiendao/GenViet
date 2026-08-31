"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const finishTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startProgress = React.useCallback(() => {
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsLoading(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        // Tăng dần chậm lại khi gần đến 85%
        const diff = (85 - prev) * 0.15;
        return prev + Math.max(diff, 1.5);
      });
    }, 120);
  }, []);

  const completeProgress = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setProgress(100);

    finishTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  // Lắng nghe khi đường dẫn hoặc search query hoàn tất cập nhật
  React.useEffect(() => {
    completeProgress();
  }, [pathname, searchParams, completeProgress]);

  // Lắng nghe các sự kiện click trên các link nội bộ
  React.useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      // Bỏ qua nếu là click chuột giữa, chuột phải, hoặc bấm kèm phím tắt (mở tab mới)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      const downloadAttr = anchor.getAttribute("download");

      // Bỏ qua nếu có target="_blank" hoặc là link tải file
      if (targetAttr === "_blank" || downloadAttr !== null) {
        return;
      }

      // Bỏ qua nếu link rỗng hoặc là hash link trong cùng trang (#section)
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Chỉ xử lý navigation nội bộ cùng origin
        if (url.origin === currentUrl.origin) {
          // Nếu URL giống hệt URL hiện tại (bao gồm query & hash), bỏ qua
          if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
            return;
          }

          startProgress();
        }
      } catch {
        // Href không hợp lệ thì bỏ qua
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, [startProgress]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Đang tải trang"
      className="pointer-events-none fixed top-0 right-0 left-0 z-[99999] h-[3px] overflow-hidden"
    >
      <div
        className="h-full bg-emerald-600 shadow-[0_0_10px_#10b981,0_0_5px_#059669] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <React.Suspense fallback={null}>
      <NavigationProgressBarInner />
    </React.Suspense>
  );
}
