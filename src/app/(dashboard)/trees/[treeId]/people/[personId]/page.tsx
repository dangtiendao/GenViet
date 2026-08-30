import React from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { PersonService } from "@/features/persons/services/person.service";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { PersonDetail } from "@/features/persons/components/person-detail";

export default async function PersonDetailPage({
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

  if (!tree || !person) {
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
          { label: person.fullName },
        ]}
      />

      <PersonDetail person={person} />
    </div>
  );
}
