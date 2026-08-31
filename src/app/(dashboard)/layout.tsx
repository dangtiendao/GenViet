import React from "react";
import { requireUser } from "@/lib/auth/require-user";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  const displayName =
    profile?.display_name ||
    (user.user_metadata?.display_name as string) ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Thành viên";

  return (
    <AppShell displayName={displayName} email={user.email}>
      {children}
    </AppShell>
  );
}
