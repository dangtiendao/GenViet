import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { FamilyTreeSwitcher } from "@/features/family-trees/components/family-tree-switcher";
import { PersonSearchClient } from "@/features/person-search/components/person-search-client";
import type {
  LivingStatusFilter,
  MissingInformationFilter,
} from "@/features/person-search/types/person-search.types";

export default async function PersonSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ treeId: string }>;
  searchParams: Promise<{
    q?: string;
    by?: string;
    ls?: string;
    mi?: string;
  }>;
}) {
  const { user } = await requireUser();
  const { treeId } = await params;
  const { q, by, ls, mi } = await searchParams;

  const [tree, allTrees] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    FamilyTreeRepository.listAccessibleTrees(user.id),
  ]);

  if (!tree) {
    notFound();
  }

  const initialBirthYear = by ? parseInt(by, 10) : null;
  const initialLivingStatus = (ls as LivingStatusFilter) || "all";
  const initialMissingInformation = (mi as MissingInformationFilter) || "none";

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AppBreadcrumb
          items={[
            { label: "Cây gia phả", href: "/trees" },
            { label: tree.name, href: `/trees/${tree.id}` },
            { label: "Danh sách nhân vật", href: `/trees/${tree.id}/people` },
            { label: "Tìm kiếm" },
          ]}
        />

        <div className="w-full sm:w-auto">
          <FamilyTreeSwitcher currentTreeId={tree.id} trees={allTrees} />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Tìm Kiếm Nhân Vật
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Tra cứu nhanh các thành viên trong cây gia phả "{tree.name}" theo họ tên (có dấu hoặc
          không dấu), năm sinh và trạng thái.
        </p>
      </div>

      {/* Main Search Component */}
      <PersonSearchClient
        treeId={tree.id}
        initialQuery={q || ""}
        initialBirthYear={initialBirthYear}
        initialLivingStatus={initialLivingStatus}
        initialMissingInformation={initialMissingInformation}
      />
    </div>
  );
}
