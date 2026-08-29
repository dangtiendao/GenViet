import React from "react";
import { requireUser } from "@/lib/auth/require-user";
import { AccountForms } from "./account-forms";

export default async function AccountPage() {
  const { user, profile } = await requireUser();

  const currentDisplayName = profile?.display_name || "";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Cài đặt tài khoản
        </h1>
        <p className="text-muted-foreground mt-1 text-xs">
          Quản lý thông tin hồ sơ và mật khẩu đăng nhập của bạn
        </p>
      </div>

      <AccountForms email={user.email || ""} initialDisplayName={currentDisplayName} />
    </div>
  );
}
