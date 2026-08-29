"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { updatePasswordAction, type ActionResult } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updatePasswordAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Thiết lập mật khẩu mới
        </h1>
        <p className="text-muted-foreground text-xs">
          Nhập mật khẩu mới cho tài khoản GenViet của bạn
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
        <label htmlFor="password" className="text-foreground block text-xs font-medium">
          Mật khẩu mới
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
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Nhập lại mật khẩu mới"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={isPending} className="h-10 w-full font-medium">
        {isPending ? "Đang lưu mật khẩu..." : "Cập nhật mật khẩu"}
      </Button>

      <div className="text-muted-foreground pt-2 text-center text-xs">
        <Link href={AUTH_ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Hủy và quay lại Đăng nhập
        </Link>
      </div>
    </form>
  );
}
