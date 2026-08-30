import React from "react";
import { Loader2 } from "lucide-react";

export function TreeLoadingState({
  message = "Đang tải dữ liệu và tính toán bố cục cây gia phả...",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center gap-3 bg-neutral-50/50 p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" aria-hidden="true" />
      <p className="text-sm font-medium text-neutral-600">{message}</p>
    </div>
  );
}
