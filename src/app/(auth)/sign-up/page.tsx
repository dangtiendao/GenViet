"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { signUpAction, type ActionResult } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    signUpAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Đăng ký tài khoản GenViet
        </h1>
        <p className="text-muted-foreground text-xs">
          Bắt đầu lưu giữ và quản lý gia phả dòng họ của bạn
        </p>
      </div>

      {state && !state.success && (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs font-medium"
        >
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="displayName" className="text-foreground block text-xs font-medium">
          Tên hiển thị
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
          placeholder="Nguyễn Văn A"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-foreground block text-xs font-medium">
          Địa chỉ Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-foreground block text-xs font-medium">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Tối thiểu 6 ký tự"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-foreground block text-xs font-medium">
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Nhập lại mật khẩu"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={isPending} className="h-10 w-full font-medium">
        {isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>

      <div className="text-muted-foreground pt-2 text-center text-xs">
        Đã có tài khoản?{" "}
        <Link href={AUTH_ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  );
}
