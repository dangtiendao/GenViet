"use client";

import React, { useEffect } from "react";
import { errorTracker } from "@/lib/observability/error-tracker";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    errorTracker.captureException(error, {
      route: "global-error",
      metadata: { digest: error.digest },
    });
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 font-sans text-neutral-900 antialiased">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-neutral-900">Đã xảy ra sự cố không mong muốn</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Hệ thống đã tự động ghi nhận mã sự cố để đội ngũ kỹ thuật khắc phục.
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-neutral-400">Mã lỗi: {error.digest}</p>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
