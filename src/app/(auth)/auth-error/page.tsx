"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { AUTH_ERROR_MAP, type AuthErrorCode } from "@/features/auth/errors";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const rawCode = searchParams.get("code") as AuthErrorCode | null;

  const errorDetail = (rawCode && AUTH_ERROR_MAP[rawCode]) || AUTH_ERROR_MAP.AUTH_UNKNOWN_ERROR;

  return (
    <div className="space-y-6 text-center">
      <div className="bg-destructive/10 text-destructive mx-auto flex h-12 w-12 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Xác thực không thành công
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed">{errorDetail.messageVi}</p>
      </div>

      <div className="space-y-2 pt-2">
        <Button asChild className="h-10 w-full font-medium">
          <Link href={AUTH_ROUTES.LOGIN}>Quay lại trang Đăng nhập</Link>
        </Button>

        {errorDetail.isRetryable && (
          <Button asChild variant="outline" className="h-10 w-full font-medium">
            <Link href={AUTH_ROUTES.FORGOT_PASSWORD}>Yêu cầu liên kết mới</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground py-6 text-center text-xs">
          Đang tải thông tin lỗi...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
