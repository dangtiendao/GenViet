import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { BackupImportForm } from "@/features/backups/components/backup-import-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nhập cây gia phả từ bản sao lưu | GenViet",
  description: "Khôi phục và tạo cây gia phả mới từ tệp sao lưu JSON chuẩn GenViet.",
};

export default async function TreeImportPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Breadcrumbs & Back button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AppBreadcrumb
          items={[
            { label: "Trang chủ", href: "/dashboard" },
            { label: "Cây gia phả", href: "/trees" },
            { label: "Nhập bản sao lưu" },
          ]}
        />

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/trees">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Quay lại danh sách cây
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Nhập Cây Gia Phả (JSON Backup)</h1>
          <p className="text-xs text-neutral-500">
            Tạo cây gia phả độc lập mới từ tệp sao lưu JSON có phiên bản (Schema v1).
          </p>
        </div>
      </div>

      {/* Import Form Component */}
      <BackupImportForm />
    </div>
  );
}
