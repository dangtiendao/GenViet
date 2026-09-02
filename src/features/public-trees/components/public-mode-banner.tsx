"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, LogIn, ExternalLink, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicModeBannerProps {
  slug: string;
  treeId?: string;
  isMember?: boolean;
  isLoggedIn?: boolean;
}

export function PublicModeBanner({
  slug,
  treeId,
  isMember = false,
  isLoggedIn = false,
}: PublicModeBannerProps) {
  const returnUrl = `/public/trees/${slug}`;
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnUrl)}`;

  return (
    <header
      role="region"
      aria-label="Chế độ xem công khai"
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 bg-emerald-50/95 px-4 py-2.5 text-xs backdrop-blur-xs sm:px-6"
    >
      <div className="flex items-center space-x-2.5 text-emerald-950">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs transition-colors hover:bg-emerald-100 hover:text-emerald-950 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          aria-label="Quay lại trang chủ GenViet"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Trang chủ</span>
        </Link>

        <div className="hidden h-4 w-px bg-emerald-300 sm:block" aria-hidden="true" />

        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span className="font-semibold">Chế độ xem công khai:</span>
          <span className="hidden text-emerald-800 md:inline">
            Dữ liệu nhân vật còn sống đã được tự động bảo vệ quyền riêng tư.
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isLoggedIn && isMember && treeId ? (
          <Link href={`/trees/${treeId}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Mở trang quản trị
            </Button>
          </Link>
        ) : !isLoggedIn ? (
          <Link href={loginUrl}>
            <Button size="sm" className="h-8 bg-emerald-700 text-white hover:bg-emerald-800">
              <LogIn className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Đăng nhập
            </Button>
          </Link>
        ) : (
          <span className="flex items-center text-neutral-600">
            <Eye className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Khách xem
          </span>
        )}
      </div>
    </header>
  );
}
