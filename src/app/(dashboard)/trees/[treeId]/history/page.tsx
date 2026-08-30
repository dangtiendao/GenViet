import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, History, ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { AuditService } from "@/features/audit/services/audit.service";
import { AuditHistoryList } from "@/features/audit/components/audit-history-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lịch sử biến động | GenViet",
  description: "Xem nhật ký thay đổi và kiểm vết các hoạt động trên cây gia phả.",
};

interface HistoryPageProps {
  params: Promise<{
    treeId: string;
  }>;
}

export default async function TreeHistoryPage({ params }: HistoryPageProps) {
  await requireUser();
  const { treeId } = await params;

  const initialData = await AuditService.listAuditHistory(treeId, { limit: 20 });

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500" aria-label="Breadcrumb">
          <Link href="/trees" className="transition-colors hover:text-neutral-900">
            Cây gia phả
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <Link href={`/trees/${treeId}`} className="transition-colors hover:text-neutral-900">
            Tổng quan
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="font-medium text-neutral-900">Lịch sử biến động</span>
        </nav>

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href={`/trees/${treeId}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Về cây gia phả
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Nhật ký biến động</h1>
          <p className="text-xs text-neutral-500">
            Truy vết các hoạt động tạo mới, chỉnh sửa, xóa và khôi phục dữ liệu trong cây gia phả.
          </p>
        </div>
      </div>

      {/* Audit History List */}
      <AuditHistoryList treeId={treeId} initialData={initialData} />
    </div>
  );
}
