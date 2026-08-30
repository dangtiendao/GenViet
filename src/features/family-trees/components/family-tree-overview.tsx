import * as React from "react";
import Link from "next/link";
import {
  GitFork,
  Users,
  Settings,
  Shield,
  Lock,
  Globe,
  Anchor,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FamilyTreeOverview as TreeOverviewType } from "../types/family-tree.types";

const ROLE_LABELS: Record<string, string> = {
  owner: "Chủ sở hữu (Owner)",
  admin: "Quản trị viên (Admin)",
  editor: "Biên tập viên (Editor)",
  viewer: "Người xem (Viewer)",
};

export function FamilyTreeOverview({ tree }: { tree: TreeOverviewType }) {
  const isPrivate = tree.privacyLevel === "private";
  const roleLabel = ROLE_LABELS[tree.role] || tree.role;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Quick Meta */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <Shield className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                {roleLabel}
              </span>

              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                {isPrivate ? (
                  <>
                    <Lock className="mr-1 h-3 w-3 text-neutral-500" aria-hidden="true" />
                    Riêng tư
                  </>
                ) : (
                  <>
                    <Globe className="mr-1 h-3 w-3 text-blue-500" aria-hidden="true" />
                    Công khai
                  </>
                )}
              </span>

              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Hoạt động
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {tree.name}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
              {tree.description || "Chưa có mô tả chi tiết cho cây gia phả này."}
            </p>
          </div>

          {tree.isOwner && (
            <div className="shrink-0">
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/trees/${tree.id}/settings`}>
                  <Settings className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Cài đặt gia phả
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Anchor and Time summary bar */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-6 text-xs text-neutral-600 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Anchor className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            <div>
              <span className="font-semibold text-neutral-800">Mốc số đời (Đời 1):</span>{" "}
              {tree.generationAnchorPersonName ? (
                <span className="font-medium text-emerald-800">
                  {tree.generationAnchorPersonName}
                </span>
              ) : (
                <span className="text-neutral-400 italic">Chưa thiết lập</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <div>
              <span className="font-semibold text-neutral-800">Cập nhật lần cuối:</span>{" "}
              {new Date(tree.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <div>
              <span className="font-semibold text-neutral-800">Phiên bản dữ liệu:</span> v
              {tree.version}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Feature Cards Navigation */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Card 1: Xem cây */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-md">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <GitFork className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Sơ đồ Cây gia phả</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              Trực quan hóa cây gia phả đa thế hệ với khả năng phóng to, thu nhỏ và tra cứu thế thứ.
            </p>
          </div>
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <span className="inline-flex cursor-not-allowed items-center text-xs font-medium text-neutral-400">
              Tính năng Canvas (Phase P15)
            </span>
          </div>
        </div>

        {/* Card 2: Thành viên & Nhân vật */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-md">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Danh sách Nhân vật</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              Quản lý hồ sơ các cụ, ông bà, con cháu kèm ngày sinh, mất, quê quán và tiểu sử.
            </p>
          </div>
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <span className="inline-flex cursor-not-allowed items-center text-xs font-medium text-neutral-400">
              Quản lý Nhân vật (Phase P12)
            </span>
          </div>
        </div>

        {/* Card 3: Cài đặt cây */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-md">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Settings className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Thiết lập Cây gia phả</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              Chỉnh sửa thông tin dòng họ, chọn mốc số đời, quản lý quyền riêng tư hoặc xóa cây.
            </p>
          </div>
          <div className="mt-6 border-t border-neutral-100 pt-4">
            {tree.isOwner ? (
              <Link
                href={`/trees/${tree.id}/settings`}
                className="inline-flex min-h-[44px] items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Vào trang cài đặt
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="text-xs text-neutral-400">Chỉ dành cho Chủ sở hữu</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
