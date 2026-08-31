import React from "react";
import { GitFork } from "lucide-react";

export default function RootLoading() {
  return (
    <div
      aria-label="Đang tải dữ liệu..."
      className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-50 p-4"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20">
          <GitFork className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center space-y-1.5">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-44 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
