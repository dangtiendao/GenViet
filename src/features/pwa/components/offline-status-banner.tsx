"use client";

import React from "react";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { useNetworkStatus } from "../hooks/use-network-status";

export function OfflineStatusBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();

  // Đang ngoại tuyến
  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs"
      >
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Thiết bị đang ngoại tuyến. Chỉnh sửa phả hệ hiện không khả dụng cho đến khi có mạng trở
          lại.
        </span>
      </div>
    );
  }

  // Vừa kết nối lại Internet
  if (wasOffline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="animate-in fade-in slide-in-from-top-1 sticky top-0 z-50 flex items-center justify-center gap-2 bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Đã khôi phục kết nối Internet. Dữ liệu đã sẵn sàng đồng bộ.</span>
      </div>
    );
  }

  return null;
}
