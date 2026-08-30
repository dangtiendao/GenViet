import React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { Button } from "@/components/ui/button";
import { RestoreTrashItemButton } from "./restore-trash-item-button";

export default async function TreeTrashPage() {
  const { user } = await requireUser();
  const deletedTrees = await FamilyTreeRepository.getDeletedTreesForOwner(user.id);

  return (
    <div className="space-y-6">
      <AppBreadcrumb
        items={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Cây gia phả", href: "/trees" },
          { label: "Thùng rác" },
        ]}
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Thùng Rác Cây Gia Phả
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Danh sách các cây gia phả bạn đã xóa mềm. Bạn có thể khôi phục lại bất kỳ lúc nào.
        </p>
      </div>

      {deletedTrees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">
            Thùng rác trống. Không có cây gia phả nào bị xóa.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/trees">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Quay lại danh sách cây
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {deletedTrees.map((tree) => (
            <div
              key={tree.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{tree.name}</h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Đã xóa vào: {new Date(tree.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <RestoreTrashItemButton treeId={tree.id} treeName={tree.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
