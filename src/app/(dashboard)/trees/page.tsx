import React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { FamilyTreeList } from "@/features/family-trees/components/family-tree-list";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";

export default async function TreesPage() {
  const { user } = await requireUser();

  const [trees, deletedTrees] = await Promise.all([
    FamilyTreeRepository.listAccessibleTrees(user.id),
    FamilyTreeRepository.getDeletedTreesForOwner(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AppBreadcrumb
          items={[{ label: "Trang chủ", href: "/dashboard" }, { label: "Cây gia phả" }]}
        />

        {deletedTrees.length > 0 && (
          <Link
            href="/trees/trash"
            className="inline-flex items-center p-1 text-xs font-medium text-neutral-500 transition-colors hover:text-red-700"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Thùng rác ({deletedTrees.length})
          </Link>
        )}
      </div>

      <FamilyTreeList trees={trees} />
    </div>
  );
}
