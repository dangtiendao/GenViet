import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { PersonCreateForm } from "@/features/persons/components/person-create-form";

export default async function NewPersonPage({ params }: { params: Promise<{ treeId: string }> }) {
  const { user } = await requireUser();
  const { treeId } = await params;

  const tree = await FamilyTreeRepository.getTreeOverview(treeId, user.id);
  if (!tree || !tree.canEdit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppBreadcrumb
        items={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Cây gia phả", href: "/trees" },
          { label: tree.name, href: `/trees/${tree.id}` },
          { label: "Danh sách nhân vật", href: `/trees/${tree.id}/people` },
          { label: "Thêm nhân vật mới" },
        ]}
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Thêm Nhân Vật Mới
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Nhập thông tin nhân vật để thêm vào cây gia phả "{tree.name}".
        </p>
      </div>

      <PersonCreateForm treeId={tree.id} />
    </div>
  );
}
