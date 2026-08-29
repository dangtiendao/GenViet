"use client";

import React, { useActionState } from "react";
import {
  updateDisplayNameAction,
  changePasswordAction,
  type ActionResult,
} from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export function AccountForms({
  email,
  initialDisplayName,
}: {
  email: string;
  initialDisplayName: string;
}) {
  const [nameState, nameAction, isNamePending] = useActionState<ActionResult | null, FormData>(
    updateDisplayNameAction,
    null
  );

  const [pwdState, pwdAction, isPwdPending] = useActionState<ActionResult | null, FormData>(
    changePasswordAction,
    null
  );

  return (
    <div className="space-y-8">
      {/* 1. Profile Display Name Form */}
      <section className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-foreground text-base font-semibold">Hồ sơ cá nhân</h2>
          <p className="text-muted-foreground text-xs">
            Tên hiển thị này sẽ được sử dụng trong các thông báo và danh sách thành viên
          </p>
        </div>

        {nameState && nameState.success && (
          <div
            role="status"
            className="border-primary/30 bg-primary/10 text-primary rounded-lg border p-3 text-xs font-medium"
          >
            {nameState.message}
          </div>
        )}

        {nameState && !nameState.success && (
          <div
            role="alert"
            className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs font-medium"
          >
            {nameState.message}
          </div>
        )}

        <form action={nameAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="emailField" className="text-foreground block text-xs font-medium">
              Địa chỉ Email (Định danh tài khoản)
            </label>
            <input
              id="emailField"
              type="email"
              disabled
              value={email}
              className="border-input bg-muted text-muted-foreground flex h-10 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="text-foreground block text-xs font-medium">
              Tên hiển thị
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              defaultValue={initialDisplayName}
              placeholder="Nhập tên hiển thị của bạn"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button type="submit" disabled={isNamePending} className="h-9 px-4 text-xs font-medium">
            {isNamePending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </section>

      {/* 2. Change Password Form */}
      <section className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-foreground text-base font-semibold">Đổi mật khẩu</h2>
          <p className="text-muted-foreground text-xs">
            Cập nhật mật khẩu bảo vệ tài khoản của bạn (Tối thiểu 6 ký tự)
          </p>
        </div>

        {pwdState && pwdState.success && (
          <div
            role="status"
            className="border-primary/30 bg-primary/10 text-primary rounded-lg border p-3 text-xs font-medium"
          >
            {pwdState.message}
          </div>
        )}

        {pwdState && !pwdState.success && (
          <div
            role="alert"
            className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs font-medium"
          >
            {pwdState.message}
          </div>
        )}

        <form action={pwdAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-foreground block text-xs font-medium">
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
              placeholder="••••••••"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button type="submit" disabled={isPwdPending} className="h-9 px-4 text-xs font-medium">
            {isPwdPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </section>
    </div>
  );
}
