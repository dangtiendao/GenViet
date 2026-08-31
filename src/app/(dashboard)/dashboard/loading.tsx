import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPageLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Đang tải dữ liệu trang chủ...">
      {/* Welcome Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-800/30 bg-emerald-950/60 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-6 w-44 animate-pulse rounded-full bg-emerald-800/60" />
            <div className="h-8 w-72 animate-pulse rounded-lg bg-emerald-800/50" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-emerald-800/40" />
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <div className="h-11 w-32 animate-pulse rounded-lg bg-emerald-800/50" />
            <div className="h-11 w-28 animate-pulse rounded-lg bg-emerald-800/30" />
          </div>
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="mt-3.5 h-3.5 w-full" />
          </div>
        ))}
      </div>

      {/* Trees Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-3.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
