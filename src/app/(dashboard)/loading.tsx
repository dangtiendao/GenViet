import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSkeleton } from "@/components/feedback/page-skeletons";

export default function DashboardGenericLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải trang...">
      <BreadcrumbSkeleton
        itemCount={2}
        rightAction={<Skeleton className="h-9 w-28 rounded-lg" />}
      />

      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
