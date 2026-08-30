"use client";

import React, { useTransition } from "react";
import { CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackupPreviewSummary } from "./backup-preview-summary";
import { BackupValidationErrors } from "./backup-validation-errors";
import type { BackupImportPreviewDto } from "../types/backup.types";

export interface BackupPreviewProps {
  preview: BackupImportPreviewDto;
  onConfirm: () => void;
  onCancel: () => void;
  isImporting?: boolean;
}

export function BackupPreview({
  preview,
  onConfirm,
  onCancel,
  isImporting = false,
}: BackupPreviewProps) {
  const canConfirm = preview.validationReport.isValid && preview.isVersionSupported;

  return (
    <div className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          Xem Trước & Xác Nhận Nhập Dữ Liệu
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          Vui lòng kiểm tra các thông số trước khi tiến hành tạo cây gia phả mới trong cơ sở dữ
          liệu.
        </p>
      </div>

      <BackupPreviewSummary preview={preview} />

      <BackupValidationErrors report={preview.validationReport} />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-100 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isImporting}
          className="h-9 text-xs"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Chọn tệp khác
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onConfirm}
          disabled={!canConfirm || isImporting}
          className="h-9 bg-emerald-700 px-5 text-xs text-white hover:bg-emerald-800"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang nhập dữ liệu...
            </>
          ) : (
            "Xác nhận nhập thành cây mới"
          )}
        </Button>
      </div>
    </div>
  );
}
