import * as React from "react";
import { Loader2 } from "lucide-react";

export default function PublicTreeLoading() {
  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu cây gia phả công khai"
      className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-50"
    >
      <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      <p className="mt-3 text-xs font-semibold text-neutral-600">Đang tải dữ liệu cây gia phả...</p>
    </div>
  );
}
