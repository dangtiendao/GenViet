"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { forgotPasswordAction, type ActionResult } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    forgotPasswordAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">Quên mật khẩu</h1>
        <p className="text-muted-foreground text-xs">
          Nhập email đăng ký tài khoản để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      {state && state.success && (
        <div
          role="status"
          className="border-primary/30 bg-primary/10 text-primary rounded-lg border p-3 text-xs font-medium"
        >
          {state.message}
        </div>
      )}

      {state && !state.success && (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs font-medium"
        >
          {state.message}
        </div>
      )}

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

      <Button type="submit" disabled={isPending} className="h-10 w-full font-medium">
        {isPending ? "Đang gửi yêu cầu..." : "Gửi liên kết đặt lại"}
      </Button>

      <div className="text-muted-foreground pt-2 text-center text-xs">
        Nhớ lại mật khẩu?{" "}
        <Link href={AUTH_ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Quay lại Đăng nhập
        </Link>
      </div>
    </form>
  );
}
