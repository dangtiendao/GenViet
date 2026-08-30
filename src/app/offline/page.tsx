"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs">
        {/* Offline Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <WifiOff className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Thiết Bị Đang Ngoại Tuyến
          </h1>
          <p className="text-xs text-neutral-600 sm:text-sm">
            Không thể thiết lập kết nối tới máy chủ GenViet. Vui lòng kiểm tra lại kết nối mạng
            Wi-Fi hoặc dữ liệu di động của bạn.
          </p>
        </div>

        {/* Unsupported Offline Editing Notice */}
        <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-left text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
            <span>Lưu ý quan trọng:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Ứng dụng hiện <strong>chưa hỗ trợ thao tác chỉnh sửa phả hệ khi ngoại tuyến</strong>.
            Mọi thay đổi về nhân vật, quan hệ và gia phả bắt buộc phải được đồng bộ trực tiếp với
            máy chủ để bảo toàn tính toàn vẹn dữ liệu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={handleReload}
            className="min-h-[44px] w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Thử lại kết nối
          </Button>

          <Button
            asChild
            variant="outline"
            className="min-h-[44px] w-full text-neutral-700 sm:w-auto"
          >
            <Link href="/dashboard">
              <Home className="mr-1.5 h-4 w-4" />
              Về bảng điều khiển
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
