import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { PersonService } from "@/features/persons/services/person.service";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { PersonEditForm } from "@/features/persons/components/person-edit-form";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ treeId: string; personId: string }>;
}) {
  const { user } = await requireUser();
  const { treeId, personId } = await params;

  const [tree, person] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    PersonService.getPersonDetail(user.id, treeId, personId),
  ]);

  if (!tree || !person || !person.canEdit) {
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
          { label: person.fullName, href: `/trees/${tree.id}/people/${person.id}` },
          { label: "Chỉnh sửa" },
        ]}
      />

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Chỉnh Sửa Hồ Sơ Nhân Vật
        </h1>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Cập nhật thông tin chi tiết cho nhân vật "{person.fullName}".
        </p>
      </div>

      <PersonEditForm person={person} />
    </div>
  );
}
