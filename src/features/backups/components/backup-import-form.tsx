"use client";

import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackupPreview } from "./backup-preview";
import { BackupValidationErrors } from "./backup-validation-errors";
import { previewBackupFileAction, importBackupFileAction } from "../actions/backup.actions";
import type { BackupImportPreviewDto, BackupValidationReport } from "../types/backup.types";

export function BackupImportForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<BackupImportPreviewDto | null>(null);
  const [validationReport, setValidationReport] = useState<BackupValidationReport | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isPreviewPending, startPreviewTransition] = useTransition();
  const [isImportPending, startImportTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralError(null);
    setPreview(null);
    setValidationReport(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setGeneralError("Dung lượng tệp vượt quá giới hạn 10 MB. Vui lòng chọn tệp nhỏ hơn.");
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);

      startPreviewTransition(async () => {
        const res = await previewBackupFileAction(content);
        if (res.success && res.data) {
          setPreview(res.data);
          setValidationReport(res.validationReport || null);
        } else {
          setGeneralError(res.error || "Tệp sao lưu không hợp lệ.");
          setValidationReport(res.validationReport || null);
        }
      });
    };
    reader.onerror = () => {
      setGeneralError("Không thể đọc nội dung tệp. Vui lòng thử lại.");
    };
    reader.readAsText(file, "utf-8");
  };

  const handleConfirmImport = () => {
    if (!fileContent || !preview) return;

    setGeneralError(null);
    startImportTransition(async () => {
      const res = await importBackupFileAction(fileContent, preview.digestSha256);
      if (res.success && res.data?.treeId) {
        router.push(`/trees/${res.data.treeId}`);
      } else {
        setGeneralError(res.error || "Nhập cây gia phả thất bại.");
        setValidationReport(res.validationReport || null);
      }
    });
  };

  const handleReset = () => {
    setFileContent(null);
    setSelectedFileName(null);
    setPreview(null);
    setValidationReport(null);
    setGeneralError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      {!preview && (
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-8 text-center transition-colors hover:border-emerald-500">
          <input
            ref={fileInputRef}
            type="file"
            id="backupFileInput"
            accept=".json,application/json"
            onChange={handleFileChange}
            disabled={isPreviewPending}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              {isPreviewPending ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <UploadCloud className="h-7 w-7" />
              )}
            </div>

            <div>
              <label
                htmlFor="backupFileInput"
                className="cursor-pointer text-sm font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                Chọn tệp sao lưu JSON từ thiết bị
              </label>
              <p className="mt-1 text-xs text-neutral-500">
                Định dạng hỗ trợ: <strong className="text-neutral-700">.json</strong> (Dung lượng
                tối đa 10 MB)
              </p>
            </div>

            {selectedFileName && isPreviewPending && (
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
                <FileText className="h-4 w-4 text-neutral-500" />
                <span>Đang kiểm tra "{selectedFileName}"...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {generalError && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div className="space-y-1">
            <span className="block font-bold">Không thể xử lý tệp sao lưu:</span>
            <span>{generalError}</span>
          </div>
        </div>
      )}

      {/* Standalone Validation Errors if preview failed */}
      {!preview && validationReport && <BackupValidationErrors report={validationReport} />}

      {/* Preview and Confirmation Box */}
      {preview && (
        <BackupPreview
          preview={preview}
          onConfirm={handleConfirmImport}
          onCancel={handleReset}
          isImporting={isImportPending}
        />
      )}
    </div>
  );
}
