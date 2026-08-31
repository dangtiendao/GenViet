import Link from "next/link";
import React from "react";
import {
  GitFork,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { Button } from "@/components/ui/button";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { FamilyTreeCard } from "@/features/family-trees/components/family-tree-card";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();

  const displayName =
    profile?.display_name ||
    (user.user_metadata?.display_name as string) ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Thành viên";
  const trees = await FamilyTreeRepository.listAccessibleTrees(user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/60 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
              <span>Không gian Gia phả &amp; Dòng tộc</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Chào mừng trở lại, {displayName}!
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-emerald-100/90 sm:text-sm">
              Lưu giữ cội nguồn, kết nối các thế hệ và quản lý thông tin phả hệ gia đình với sự
              riêng tư và bảo mật tuyệt đối.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              asChild
              className="min-h-[44px] bg-white text-emerald-900 shadow-sm hover:bg-neutral-100"
            >
              <Link href="/trees/new">
                <Plus className="mr-1.5 h-4 w-4 text-emerald-700" aria-hidden="true" />
                Tạo cây mới
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[44px] border-emerald-600/60 bg-emerald-800/40 text-white hover:bg-emerald-700/60 hover:text-white"
            >
              <Link href="/search">
                <Search className="mr-1.5 h-4 w-4 text-emerald-200" aria-hidden="true" />
                Tìm kiếm
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-emerald-600/20 blur-2xl" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-32 w-32 rounded-full bg-teal-400/10 blur-xl" />
      </div>

      {/* Quick Stats & Features Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <GitFork className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Cây gia phả tham gia</p>
              <p className="text-xl font-bold text-neutral-900">{trees.length}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            {trees.length > 0
              ? "Bạn có thể chỉnh sửa và cập nhật phả đồ bất cứ lúc nào."
              : "Bắt đầu tạo cây đầu tiên để kết nối các thế hệ."}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Xưng hô &amp; Họ hàng</p>
              <p className="text-sm font-semibold text-neutral-900">Chuẩn mực Việt Nam</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Hệ thống tự động phân tích thứ bậc và danh xưng họ hàng theo gia phong.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Quyền riêng tư</p>
              <p className="text-sm font-semibold text-neutral-900">Bảo mật gia đình</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Dữ liệu dòng tộc được bảo mật tuyệt đối và chỉ chia sẻ cho người được cấp quyền.
          </p>
        </div>
      </div>

      {/* Trees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Cây gia phả gần đây</h2>
            <p className="text-xs text-neutral-500">
              Danh sách các cây gia phả bạn đang tham gia quản lý
            </p>
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
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-8 text-center sm:p-12">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <GitFork className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Chưa có cây gia phả nào</h3>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Bắt đầu hành trình lưu giữ cội nguồn gia tộc bằng cách khởi tạo cây gia phả đầu tiên
              của bạn.
            </p>
            <div className="mt-6">
              <Button
                asChild
                className="min-h-[44px] bg-emerald-700 px-6 text-white hover:bg-emerald-800"
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
            {trees.slice(0, 6).map((tree) => (
              <FamilyTreeCard key={tree.id} tree={tree} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
