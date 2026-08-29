"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState, Suspense } from "react";
import { signInAction, type ActionResult } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "";

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    signInAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="redirectTo" value={nextParam} />

      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Đăng nhập vào GenViet
        </h1>
        <p className="text-muted-foreground text-xs">Nhập email và mật khẩu của bạn để tiếp tục</p>
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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-foreground block text-xs font-medium">
            Mật khẩu
          </label>
          <Link
            href={AUTH_ROUTES.FORGOT_PASSWORD}
            className="text-primary text-xs font-medium hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={isPending} className="h-10 w-full font-medium">
        {isPending ? "Đang xử lý..." : "Đăng nhập"}
      </Button>

      <div className="text-muted-foreground pt-2 text-center text-xs">
        Chưa có tài khoản?{" "}
        <Link href={AUTH_ROUTES.SIGN_UP} className="text-primary font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground py-6 text-center text-xs">Đang tải biểu mẫu...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
