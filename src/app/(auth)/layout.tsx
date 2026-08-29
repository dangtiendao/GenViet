import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="text-primary inline-block text-2xl font-bold tracking-tight transition-opacity hover:opacity-90"
          >
            GenViet
          </Link>
          <p className="text-muted-foreground text-sm">
            Phần mềm quản lý cây gia phả trực quan &amp; chuẩn mực
          </p>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">{children}</div>

        <div className="text-muted-foreground text-center text-xs">
          &copy; {new Date().getFullYear()} GenViet. Bảo lưu mọi quyền.
        </div>
      </div>
    </div>
  );
}
