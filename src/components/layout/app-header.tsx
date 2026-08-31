"use client";

import * as React from "react";
import Link from "next/link";
import { GitFork, LogOut, User as UserIcon } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { PwaInstallButton } from "@/features/pwa/components/pwa-install-button";
import { performClientSessionCleanup } from "@/lib/auth/session-cleanup";

export interface AppHeaderProps {
  displayName?: string | null;
  email?: string | null;
  children?: React.ReactNode;
}

export function AppHeader({ displayName, email, children }: AppHeaderProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleSignOut = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        // 1. Clean up client sessionStorage, Service Worker private cache, and client auth state
        await performClientSessionCleanup();

        // 2. Destroy server session via Server Action
        await signOutAction();
      } catch (err) {
        console.warn("[app-header] Server signOut fallback triggered:", err);
        // Direct browser fallback navigation to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
      {/* Left side: Mobile Brand + Desktop Breadcrumbs/Slot */}
      <div className="flex items-center space-x-3 truncate">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 rounded p-1 font-bold text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none lg:hidden"
          aria-label="GenViet Trang chủ"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-700 text-white shadow-xs">
            <GitFork className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight">GenViet</span>
        </Link>

        <div className="hidden truncate lg:block">{children}</div>
      </div>

      {/* Right side: PWA Install + User menu & Sign out */}
      <div className="flex items-center space-x-3">
        <PwaInstallButton className="hidden sm:inline-flex" />

        <Link
          href="/account"
          className="flex min-h-[44px] items-center space-x-2 rounded-lg p-1.5 text-sm text-neutral-700 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          aria-label="Cài đặt tài khoản người dùng"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <UserIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="max-w-[140px] truncate text-xs leading-none font-semibold text-neutral-900">
              {displayName || email?.split("@")[0] || "Thành viên"}
            </p>
            <p className="mt-0.5 max-w-[140px] truncate text-[10px] leading-none text-neutral-500">
              {email}
            </p>
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isPending}
          className="min-h-[44px] min-w-[44px] text-neutral-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          aria-label="Đăng xuất khỏi tài khoản"
        >
          <LogOut className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
          <span className="hidden sm:inline">{isPending ? "Đang xử lý..." : "Đăng xuất"}</span>
        </Button>
      </div>
    </header>
  );
}
