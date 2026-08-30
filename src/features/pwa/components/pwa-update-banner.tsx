"use client";

import React from "react";
import { RefreshCw, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceWorkerUpdate } from "../hooks/use-service-worker-update";

export function PwaUpdateBanner() {
  const { isUpdateAvailable, isUpdating, applyUpdate, dismissUpdate } = useServiceWorkerUpdate();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="animate-in fade-in slide-in-from-bottom-2 fixed right-4 bottom-4 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-xs font-bold text-neutral-900">Đã có phiên bản mới!</h4>
          <p className="text-[11px] leading-relaxed text-neutral-500">
            Ứng dụng GenViet vừa được cập nhật tính năng mới. Bạn có muốn tải lại để áp dụng ngay
            không?
          </p>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              onClick={applyUpdate}
              disabled={isUpdating}
              className="h-7 bg-emerald-700 px-3 text-[11px] font-semibold text-white hover:bg-emerald-800"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Cập nhật ngay
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={dismissUpdate}
              disabled={isUpdating}
              className="h-7 px-2 text-[11px] text-neutral-500"
            >
              Để sau
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissUpdate}
          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Đóng thông báo cập nhật"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
