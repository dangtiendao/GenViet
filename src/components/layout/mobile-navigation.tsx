"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAVIGATION, type NavigationItem } from "@/config/navigation";

export function MobileNavigation() {
  const pathname = usePathname();

  const mobileItems = MAIN_NAVIGATION.filter((item) => item.showInMobileNav);

  return (
    <nav
      aria-label="Điều hướng dưới màn hình"
      className="fixed right-0 bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xs lg:hidden"
    >
      {mobileItems.map((item: NavigationItem) => {
        const isActive =
          pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        if (!item.isImplemented) {
          return (
            <div
              key={item.key}
              className="flex min-h-[44px] min-w-[44px] flex-1 cursor-not-allowed flex-col items-center justify-center py-1 text-[11px] font-medium text-neutral-400 opacity-50"
              aria-disabled="true"
              title={`${item.label} (Đang phát triển)`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="mt-1 leading-none">{item.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none",
              isActive
                ? "font-semibold text-emerald-700"
                : "text-neutral-600 hover:text-neutral-900 active:text-emerald-700"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn("h-5 w-5 transition-transform", isActive && "scale-110")}
              aria-hidden="true"
            />
            <span className="mt-1 max-w-[64px] truncate leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
