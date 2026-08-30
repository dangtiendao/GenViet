import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { FamilyTreeOverview } from "@/features/family-trees/components/family-tree-overview";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { FamilyTreeSwitcher } from "@/features/family-trees/components/family-tree-switcher";

export default async function TreeOverviewPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { user } = await requireUser();
  const { treeId } = await params;

  const [tree, allTrees] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    FamilyTreeRepository.listAccessibleTrees(user.id),
  ]);

  if (!tree) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AppBreadcrumb
          items={[
            { label: "Trang chủ", href: "/dashboard" },
            { label: "Cây gia phả", href: "/trees" },
            { label: tree.name },
          ]}
        />

        <FamilyTreeSwitcher currentTreeId={tree.id} trees={allTrees} />
      </div>

      <FamilyTreeOverview tree={tree} />
    </div>
  );
}
