import Link from "next/link";
import React from "react";
import { requireUser } from "@/lib/auth/require-user";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();

  const displayName = profile?.display_name || user.email || "Thành viên";

  return (
    <div className="space-y-6">
      <div className="bg-card space-y-3 rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
          Phiên bản v0.1-preview
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Chào mừng trở lại, {displayName}!
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          Tài khoản của bạn đã được xác thực an toàn. Bạn có thể cập nhật thông tin cá nhân hoặc sẵn
          sàng đón nhận các tính năng quản trị cây gia phả trong các phiên bản kế tiếp.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild className="h-9 text-xs font-medium">
            <Link href={AUTH_ROUTES.ACCOUNT}>Cài đặt tài khoản</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card space-y-2 rounded-lg border p-5">
          <h2 className="text-foreground text-sm font-semibold">Hồ sơ cá nhân</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Quản lý tên hiển thị và mật khẩu tài khoản đăng nhập của bạn.
          </p>
          <div className="pt-2">
            <Link
              href={AUTH_ROUTES.ACCOUNT}
              className="text-primary text-xs font-medium hover:underline"
            >
              Chỉnh sửa hồ sơ &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card space-y-2 rounded-lg border p-5">
          <h2 className="text-foreground text-sm font-semibold">Cây gia phả</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Chức năng khởi tạo và quản lý cây gia phả dòng họ (Sẽ có trong Phase P11).
          </p>
          <div className="pt-2">
            <span className="text-muted-foreground text-xs font-medium">Sắp ra mắt</span>
          </div>
        </div>

        <div className="bg-card space-y-2 rounded-lg border p-5">
          <h2 className="text-foreground text-sm font-semibold">Bảo mật tài khoản</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Phiên làm việc được mã hóa bảo mật với HTTP-Only Cookie và Supabase SSR.
          </p>
          <div className="pt-2">
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Đang kích hoạt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
