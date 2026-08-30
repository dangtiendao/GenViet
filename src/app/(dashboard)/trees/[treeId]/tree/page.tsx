import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { PersonRepository } from "@/features/persons/repositories/person.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { FamilyTreeSwitcher } from "@/features/family-trees/components/family-tree-switcher";
import { FamilyTreeClient } from "@/features/tree-view/components/family-tree-client";

export default async function TreeVisualizationPage({
  params,
  searchParams,
}: {
  params: Promise<{ treeId: string }>;
  searchParams: Promise<{ centerPersonId?: string }>;
}) {
  const { user } = await requireUser();
  const { treeId } = await params;
  const { centerPersonId: queryCenterPersonId } = await searchParams;

  const [tree, allTrees, people] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    FamilyTreeRepository.listAccessibleTrees(user.id),
    PersonRepository.listActivePeopleByTree(treeId),
  ]);

  if (!tree) {
    notFound();
  }

  // Xác định Center Person khởi tạo
  let initialCenterPersonId: string | null = null;

  if (queryCenterPersonId && people.some((p) => p.id === queryCenterPersonId)) {
    initialCenterPersonId = queryCenterPersonId;
  } else if (
    tree.generationAnchorPersonId &&
    people.some((p) => p.id === tree.generationAnchorPersonId)
  ) {
    initialCenterPersonId = tree.generationAnchorPersonId;
  } else if (people.length > 0) {
    initialCenterPersonId = people[0].id;
  }

  const canWrite = tree.role === "owner" || tree.role === "admin" || tree.role === "editor";

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AppBreadcrumb
          items={[
            { label: "Cây gia phả", href: "/trees" },
            { label: tree.name, href: `/trees/${tree.id}` },
            { label: "Sơ đồ cây" },
          ]}
        />

        <div className="w-full sm:w-auto">
          <FamilyTreeSwitcher currentTreeId={tree.id} trees={allTrees} />
        </div>
      </div>

      {/* Main Family Tree Visualization Canvas */}
      <FamilyTreeClient
        treeId={tree.id}
        initialCenterPersonId={initialCenterPersonId}
        canWrite={canWrite}
      />
    </div>
  );
}
