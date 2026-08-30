import React from "react";
import { AlertCircle } from "lucide-react";

export interface OfflineEditingNoticeProps {
  className?: string;
}

export function OfflineEditingNotice({ className = "" }: OfflineEditingNoticeProps) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="space-y-0.5">
        <span className="block font-bold">Yêu cầu kết nối mạng:</span>
        <p className="text-[11px] leading-normal text-amber-800">
          Ứng dụng hiện chưa hỗ trợ lưu trữ hoặc tạo hàng đợi thao tác khi ngoại tuyến. Bạn cần có
          kết nối Internet ổn định để lưu thay đổi dữ liệu gia phả.
        </p>
      </div>
    </div>
  );
}
