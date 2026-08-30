import React from "react";
import { History } from "lucide-react";

export interface AuditEmptyStateProps {
  isFiltered?: boolean;
}

export function AuditEmptyState({ isFiltered }: AuditEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <History className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-neutral-900">
        {isFiltered ? "Không tìm thấy biến động phù hợp" : "Chưa có lịch sử biến động"}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-neutral-500">
        {isFiltered
          ? "Hãy thử thay đổi hoặc xóa các tiêu chí lọc để xem thêm lịch sử."
          : "Các hoạt động tạo mới, cập nhật, xóa hoặc khôi phục dữ liệu sẽ được ghi nhận tại đây."}
      </p>
    </div>
  );
}
