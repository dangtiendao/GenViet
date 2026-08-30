import Link from "next/link";
import React from "react";
import { GitFork, Plus, ArrowRight, User } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { FamilyTreeCard } from "@/features/family-trees/components/family-tree-card";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Thành viên";
  const trees = await FamilyTreeRepository.listAccessibleTrees(user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Phiên bản v0.1-baseline
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Chào mừng trở lại, {displayName}!
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Hệ thống quản lý cây gia phả chuẩn mực GenViet. Bạn có thể tra cứu, tạo mới và quản lý
              dòng họ của mình.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button asChild className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800">
              <Link href="/trees/new">
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Tạo cây mới
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href={AUTH_ROUTES.ACCOUNT}>
                <User className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Tài khoản
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Cây gia phả gần đây</h2>
            <p className="text-xs text-neutral-500">Các cây gia phả bạn đang tham gia quản lý</p>
          </div>

          {trees.length > 0 && (
            <Link
              href="/trees"
              className="inline-flex min-h-[44px] items-center p-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Xem tất cả ({trees.length})
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {trees.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <GitFork className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">Chưa có cây gia phả nào</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-neutral-500">
              Bắt đầu hành trình lưu giữ cội nguồn bằng cách tạo cây gia phả đầu tiên của gia đình.
            </p>
            <div className="mt-5">
              <Button
                asChild
                className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800"
              >
                <Link href="/trees/new">
                  <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Tạo cây gia phả đầu tiên
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trees.slice(0, 3).map((tree) => (
              <FamilyTreeCard key={tree.id} tree={tree} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
