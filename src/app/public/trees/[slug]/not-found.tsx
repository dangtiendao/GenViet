import * as React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicTreeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800 shadow-xs">
        <ShieldAlert className="h-8 w-8" aria-hidden="true" />
      </div>

      <h1 className="mt-4 text-lg font-bold text-neutral-900 sm:text-xl">
        Cây gia phả không khả dụng
      </h1>

      <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-600 sm:text-sm">
        Cây gia phả bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đang được đặt ở chế độ riêng tư
        bởi chủ sở hữu.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="outline" className="min-h-[40px] text-xs">
            <Home className="mr-1.5 h-4 w-4" />
            Trang chủ
          </Button>
        </Link>

        <Link href="/login">
          <Button className="min-h-[40px] bg-emerald-700 text-xs text-white hover:bg-emerald-800">
            <LogIn className="mr-1.5 h-4 w-4" />
            Đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
}
