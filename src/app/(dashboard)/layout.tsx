import Link from "next/link";
import React from "react";
import { requireUser } from "@/lib/auth/require-user";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  const displayName = profile?.display_name || user.email || "Thành viên";

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Dashboard App Header */}
      <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href={AUTH_ROUTES.DASHBOARD}
              className="text-primary text-lg font-bold tracking-tight transition-opacity hover:opacity-90"
            >
              GenViet
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
              <Link
                href={AUTH_ROUTES.DASHBOARD}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Tổng quan
              </Link>
              <Link
                href={AUTH_ROUTES.ACCOUNT}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Tài khoản
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-foreground text-xs font-medium">{displayName}</p>
              <p className="text-muted-foreground text-[10px]">{user.email}</p>
            </div>

            <Link
              href={AUTH_ROUTES.ACCOUNT}
              className="text-muted-foreground hover:text-foreground text-xs sm:hidden"
            >
              {displayName}
            </Link>

            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium"
              >
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Dashboard Footer */}
      <footer className="text-muted-foreground border-t py-4 text-center text-xs">
        GenViet v0.1 &bull; Nền tảng quản lý cây gia phả chuẩn mực &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
