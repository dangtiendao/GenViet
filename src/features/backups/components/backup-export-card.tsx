"use client";

import React, { useState } from "react";
import { Download, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BackupExportCardProps {
  treeId: string;
  treeName: string;
}

export function BackupExportCard({ treeId, treeName }: BackupExportCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);

      const res = await fetch(`/api/trees/${treeId}/backup`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Không thể xuất bản sao lưu.");
      }

      // Đọc blob và kích hoạt download
      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `genviet-backup-${treeId}.json`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("[BackupExportCard] Download failed:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải tệp sao lưu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <Download className="h-5 w-5 text-emerald-700" />
            Xuất Bản Sao Lưu (JSON)
          </h3>
          <p className="mt-1 max-w-xl text-xs text-neutral-500">
            Tải về tệp JSON chứa toàn bộ dữ liệu phả hệ của cây gia phả "{treeName}" (nhân vật, các
            mối quan hệ, hôn nhân và thông tin mốc thế hệ).
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="h-9 shrink-0 bg-emerald-700 text-xs text-white hover:bg-emerald-800"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang xuất tệp...
            </>
          ) : (
            <>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Tải tệp sao lưu (.json)
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600">
        <div className="flex items-center gap-1.5 font-medium text-neutral-900">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          Bảo mật & Quyền riêng tư:
        </div>
        <ul className="list-disc space-y-0.5 pl-5 text-[11px] text-neutral-500">
          <li>Tệp JSON chuẩn hóa theo định dạng GenViet Schema v1.</li>
          <li>Không chứa mật khẩu, mã token truy cập hoặc thông tin tài khoản người dùng.</li>
          <li>Ảnh đại diện chỉ lưu siêu dữ liệu (không xuất tệp nhị phân ảnh).</li>
        </ul>
      </div>
    </div>
  );
}
