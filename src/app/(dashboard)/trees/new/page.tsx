import React from "react";
import { requireUser } from "@/lib/auth/require-user";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { FamilyTreeForm } from "@/features/family-trees/components/family-tree-form";

export default async function NewTreePage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <AppBreadcrumb
        items={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Cây gia phả", href: "/trees" },
          { label: "Tạo cây mới" },
        ]}
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Tạo Cây Gia Phả Mới
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Khởi tạo không gian gia phả riêng biệt để bắt đầu kết nối các thế hệ trong dòng họ.
        </p>
      </div>

      <FamilyTreeForm />
    </div>
  );
}
