import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { FamilyTreeSettingsForm } from "@/features/family-trees/components/family-tree-settings-form";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";

export default async function TreeSettingsPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { user } = await requireUser();
  const { treeId } = await params;

  const [tree, people] = await Promise.all([
    FamilyTreeRepository.getTreeSettings(treeId, user.id),
    FamilyTreeRepository.listTreePeopleForSelector(treeId),
  ]);

  if (!tree) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppBreadcrumb
        items={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Cây gia phả", href: "/trees" },
          { label: tree.name, href: `/trees/${tree.id}` },
          { label: "Cài đặt" },
        ]}
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Cài Đặt Cây Gia Phả
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Chỉnh sửa thông tin, mốc số đời, quyền riêng tư hoặc quản lý vòng đời cây gia phả.
        </p>
      </div>

      <FamilyTreeSettingsForm tree={tree} people={people} />
    </div>
  );
}
