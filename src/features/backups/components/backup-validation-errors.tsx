import React from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import type { BackupValidationReport } from "../types/backup.types";

export interface BackupValidationErrorsProps {
  report: BackupValidationReport;
}

const SECTION_LABELS: Record<string, string> = {
  file: "Tệp sao lưu",
  tree: "Cây gia phả",
  persons: "Nhân vật",
  parentChildRelationships: "Quan hệ Cha/Mẹ - Con",
  unions: "Quan hệ Hôn nhân",
  unionMembers: "Thành viên Hôn nhân",
  mediaMetadata: "Ảnh đại diện",
  manifest: "Tổng kết bản ghi",
};

export function BackupValidationErrors({ report }: BackupValidationErrorsProps) {
  const { errors, warnings, additionalErrorsCount } = report;

  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Errors Section */}
      {errors.length > 0 && (
        <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span>
              Phát hiện {errors.length + (additionalErrorsCount || 0)} lỗi trong tệp sao lưu:
            </span>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {errors.map((err, idx) => (
              <div
                key={idx}
                className="space-y-1 rounded-lg border border-rose-200 bg-white p-3 text-xs shadow-2xs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-medium text-rose-800">
                    {SECTION_LABELS[err.section] || err.section}
                  </span>
                  {err.recordIndex !== undefined && (
                    <span className="font-mono text-[11px] text-neutral-500">
                      Bản ghi #{err.recordIndex + 1}
                    </span>
                  )}
                  {err.fieldPath && (
                    <span className="font-mono text-[10px] text-neutral-400">
                      ({err.fieldPath})
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-neutral-800">{err.message}</p>
              </div>
            ))}
          </div>

          {additionalErrorsCount && additionalErrorsCount > 0 ? (
            <p className="text-xs text-rose-700 italic">
              ...và còn {additionalErrorsCount} lỗi khác chưa được hiển thị. Vui lòng sửa các lỗi
              trên trước.
            </p>
          ) : null}
        </div>
      )}

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Lưu ý khi nhập dữ liệu ({warnings.length}):</span>
          </div>

          <div className="space-y-2">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-amber-200 bg-white p-2.5 text-xs text-amber-900 shadow-2xs"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{w.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
