import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2, ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { PersonRepository } from "@/features/persons/repositories/person.repository";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { TrashPersonRow } from "@/features/persons/components/trash-person-row";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";

export default async function PeopleTrashPage({ params }: { params: Promise<{ treeId: string }> }) {
  const { user } = await requireUser();
  const { treeId } = await params;

  const [tree, deletedPeople] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    PersonRepository.getDeletedPeopleByTree(treeId),
  ]);

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
          { label: "Thùng rác" },
        ]}
      />

      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            <Trash2 className="mr-2 h-5 w-5 text-red-600" aria-hidden="true" />
            Thùng Rác Nhân Vật
          </h1>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            Danh sách các nhân vật đã bị xóa mềm trong cây gia phả "{tree.name}".
          </p>
        </div>

        <div>
          <Button asChild variant="outline">
            <Link href={`/trees/${tree.id}/people`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>

      {deletedPeople.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="h-7 w-7" />}
          title="Thùng rác trống"
          description="Hiện không có nhân vật nào trong thùng rác của cây gia phả này."
          primaryAction={{
            label: "Quay lại danh sách nhân vật",
            href: `/trees/${tree.id}/people`,
          }}
        />
      ) : (
        <div className="max-w-3xl space-y-3">
          {deletedPeople.map((person) => (
            <TrashPersonRow key={person.id} treeId={tree.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
