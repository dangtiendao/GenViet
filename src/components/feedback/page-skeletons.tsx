import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 1. Base Breadcrumb Skeleton
 */
export function BreadcrumbSkeleton({
  itemCount = 2,
  className,
  rightAction,
}: {
  itemCount?: number;
  className?: string;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-2">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-neutral-300">/</span>}
            <Skeleton
              className={cn("h-4", idx === itemCount - 1 ? "w-28 sm:w-36" : "w-16 sm:w-20")}
            />
          </React.Fragment>
        ))}
      </div>
      {rightAction}
    </div>
  );
}

/**
 * 2. Base Header Bar Skeleton
 */
export function HeaderBarSkeleton({
  titleWidth = "w-48 sm:w-56",
  subtitleWidth = "w-72 sm:w-80",
  actionCount = 1,
  className,
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  actionCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1.5">
        <Skeleton className={cn("h-7", titleWidth)} />
        {subtitleWidth && <Skeleton className={cn("h-4", subtitleWidth)} />}
      </div>

      {actionCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: actionCount }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-28 rounded-lg sm:w-32" />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 3. Base Cards Grid Page Skeleton
 * Dùng cho: Danh sách cây gia phả, Danh sách nhân vật, Thùng rác cây, Thùng rác nhân vật
 */
export function CardsGridPageSkeleton({
  breadcrumbsCount = 2,
  titleWidth = "w-48",
  subtitleWidth = "w-72",
  actionCount = 2,
  hasSearchFilter = true,
  cardCount = 6,
  cardType = "default",
}: {
  breadcrumbsCount?: number;
  titleWidth?: string;
  subtitleWidth?: string;
  actionCount?: number;
  hasSearchFilter?: boolean;
  cardCount?: number;
  cardType?: "tree" | "person" | "trash" | "default";
}) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải danh sách...">
      {breadcrumbsCount > 0 && <BreadcrumbSkeleton itemCount={breadcrumbsCount} />}

      <HeaderBarSkeleton
        titleWidth={titleWidth}
        subtitleWidth={subtitleWidth}
        actionCount={actionCount}
      />

      {hasSearchFilter && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-40" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs"
          >
            {cardType === "person" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-40" />
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-44" />
                </div>
              </div>
            ) : cardType === "trash" ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            )}

            {cardType !== "trash" && (
              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 4. Base Form Page Skeleton
 * Dùng cho: Tạo cây mới, Nhập dữ liệu, Thêm/Sửa nhân vật, Cài đặt cây, Cài đặt tài khoản
 */
export function FormPageSkeleton({
  breadcrumbsCount = 2,
  maxWidth = "max-w-2xl",
  titleWidth = "w-52",
  subtitleWidth = "w-72",
  fieldRows = 3,
  hasAvatar = false,
  hasFileUpload = false,
  hasDangerZone = false,
}: {
  breadcrumbsCount?: number;
  maxWidth?: "max-w-2xl" | "max-w-3xl" | "max-w-4xl";
  titleWidth?: string;
  subtitleWidth?: string;
  fieldRows?: number;
  hasAvatar?: boolean;
  hasFileUpload?: boolean;
  hasDangerZone?: boolean;
}) {
  return (
    <div className={cn("space-y-6", maxWidth)} aria-busy="true" aria-label="Đang tải biểu mẫu...">
      {breadcrumbsCount > 0 && <BreadcrumbSkeleton itemCount={breadcrumbsCount} />}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="space-y-1.5 border-b border-neutral-100 pb-5">
          <Skeleton className={cn("h-7", titleWidth)} />
          <Skeleton className={cn("h-4", subtitleWidth)} />
        </div>

        <div className="mt-6 space-y-6">
          {hasAvatar && (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          )}

          {hasFileUpload && (
            <Skeleton className="h-36 w-full rounded-xl border border-dashed border-neutral-300" />
          )}

          {Array.from({ length: fieldRows }).map((_, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {hasDangerZone && (
        <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-xs sm:p-8">
          <div className="space-y-1.5 pb-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      )}
    </div>
  );
}

/**
 * 5. Base Detail Page Skeleton
 * Dùng cho: Tổng quan cây gia phả, Chi tiết nhân vật
 */
export function DetailPageSkeleton({
  breadcrumbsCount = 3,
  type = "tree",
}: {
  breadcrumbsCount?: number;
  type?: "tree" | "person";
}) {
  return (
    <div
      className={cn("space-y-6", type === "person" ? "max-w-4xl" : "space-y-8")}
      aria-busy="true"
      aria-label="Đang tải chi tiết..."
    >
      {breadcrumbsCount > 0 && (
        <BreadcrumbSkeleton
          itemCount={breadcrumbsCount}
          rightAction={type === "tree" ? <Skeleton className="h-9 w-44 rounded-lg" /> : undefined}
        />
      )}

      {/* Main Profile / Header Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 items-start space-x-4">
            {type === "person" && (
              <Skeleton className="h-20 w-20 shrink-0 rounded-full sm:h-24 sm:w-24" />
            )}

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            {type === "person" && <Skeleton className="h-10 w-36 rounded-lg" />}
          </div>
        </div>

        {/* Vital Info bar */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      {/* Sub Cards Section */}
      {type === "tree" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-2xs"
            >
              <div className="space-y-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-4">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 6. Base Canvas Page Skeleton
 * Dùng cho: Sơ đồ cây gia phả canvas (tree view)
 */
export function CanvasPageSkeleton({ breadcrumbsCount = 3 }: { breadcrumbsCount?: number }) {
  return (
    <div className="flex flex-col space-y-4" aria-busy="true" aria-label="Đang tải sơ đồ cây...">
      <BreadcrumbSkeleton
        itemCount={breadcrumbsCount}
        rightAction={<Skeleton className="h-9 w-44 rounded-lg" />}
      />

      <div className="relative flex h-[calc(100vh-14rem)] min-h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/60 shadow-inner">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 rounded-xl border border-neutral-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur-xs">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="h-4 w-[1px] bg-neutral-200" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        <div className="absolute right-6 bottom-6 z-10 flex flex-col space-y-1.5 rounded-xl border border-neutral-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur-xs">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-600" aria-hidden="true" />
          </div>

          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-neutral-800">
              Đang tính toán bố cục sơ đồ cây...
            </p>
            <p className="text-xs text-neutral-500">
              Đang tải thông tin các thế hệ và thiết lập tọa độ các nhánh
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
            <Skeleton className="h-20 w-36 rounded-xl border border-neutral-200 bg-white" />
            <div className="h-[2px] w-8 bg-neutral-300" />
            <Skeleton className="h-20 w-36 rounded-xl border border-neutral-200 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 7. Base Search Page Skeleton
 * Dùng cho: Tìm kiếm toàn hệ thống / Tìm kiếm nâng cao trong cây
 */
export function SearchPageSkeleton({
  breadcrumbsCount = 0,
  title = "Tìm Kiếm",
  resultCount = 4,
}: {
  breadcrumbsCount?: number;
  title?: string;
  resultCount?: number;
}) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải tìm kiếm...">
      {breadcrumbsCount > 0 && <BreadcrumbSkeleton itemCount={breadcrumbsCount} />}

      <div className="space-y-1.5 border-b border-neutral-200 pb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      <div className="space-y-3 pt-2">
        {Array.from({ length: resultCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs"
          >
            <div className="flex items-center space-x-3.5">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 8. Base Timeline Page Skeleton
 * Dùng cho: Lịch sử hoạt động / Audit trail
 */
export function TimelinePageSkeleton({
  breadcrumbsCount = 3,
  itemCount = 4,
}: {
  breadcrumbsCount?: number;
  itemCount?: number;
}) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải dòng thời gian...">
      {breadcrumbsCount > 0 && <BreadcrumbSkeleton itemCount={breadcrumbsCount} />}

      <div className="space-y-1.5 border-b border-neutral-200 pb-4">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs"
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 9. Base Auth Card Skeleton
 * Dùng cho: Các màn hình trong phân hệ (auth)
 */
export function AuthCardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải biểu mẫu xác thực...">
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3.5 w-64" />
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <Skeleton className="h-10 w-full rounded-md" />

        <div className="flex justify-center pt-2">
          <Skeleton className="h-3.5 w-44" />
        </div>
      </div>
    </div>
  );
}
