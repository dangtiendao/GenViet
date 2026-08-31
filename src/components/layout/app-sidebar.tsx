"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitFork } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION, type NavigationItem } from "@/config/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const desktopItems = MAIN_NAVIGATION.filter((item) => item.showInDesktopSidebar);

  return (
    <aside
      aria-label="Sidebar chính"
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-neutral-200 bg-white select-none lg:flex"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-3 rounded p-1 font-bold text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          aria-label="GenViet Trang chủ"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-sm">
            <GitFork className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-tight tracking-tight">GenViet</span>
            <span className="text-[10px] font-normal text-neutral-500">Cây Gia Phả Việt</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4" aria-label="Menu chức năng">
        {desktopItems.map((item: NavigationItem) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (!item.isImplemented) {
            return (
              <div
                key={item.key}
                className="flex cursor-not-allowed items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 opacity-60"
                title={`${item.label} (Đang phát triển)`}
                aria-disabled="true"
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
                <span className="ml-auto rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                  Sắp có
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex min-h-[44px] items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none",
                isActive
                  ? "bg-emerald-50 font-semibold text-emerald-800 shadow-2xs"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-emerald-700" : "text-neutral-500"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-neutral-200 p-4 text-center text-xs text-neutral-500">
        <span>GenViet • Gìn giữ cội nguồn</span>
      </div>
    </aside>
  );
}
