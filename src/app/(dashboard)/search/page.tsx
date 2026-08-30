import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { EmptyState } from "@/components/feedback/empty-state";
import { GitFork, Plus } from "lucide-react";

export default async function GlobalSearchPage() {
  const { user } = await requireUser();
  const trees = await FamilyTreeRepository.listAccessibleTrees(user.id);

  if (trees.length > 0) {
    redirect(`/trees/${trees[0].id}/people/search`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Tìm Kiếm Gia Phả
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Tra cứu thành viên và hồ sơ gia phả trong các cây phả hệ của bạn.
        </p>
      </div>

      <EmptyState
        icon={<GitFork className="h-8 w-8 text-neutral-400" />}
        title="Chưa có cây gia phả nào để tìm kiếm"
        description="Hãy tạo hoặc tham gia vào một cây gia phả trước khi thực hiện tra cứu thành viên."
        primaryAction={{
          label: "Tạo cây gia phả mới",
          href: "/trees/new",
        }}
      />
    </div>
  );
}
