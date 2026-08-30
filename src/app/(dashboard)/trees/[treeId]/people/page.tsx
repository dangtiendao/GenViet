import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserPlus, Users, Trash2, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/require-user";
import { PersonRepository } from "@/features/persons/repositories/person.repository";
import { FamilyTreeRepository } from "@/features/family-trees/repositories/family-tree.repository";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatGenealogyDate } from "@/features/persons/utils/partial-date-mapper";

export default async function PeoplePage({ params }: { params: Promise<{ treeId: string }> }) {
  const { user } = await requireUser();
  const { treeId } = await params;

  const [tree, people, deletedPeople] = await Promise.all([
    FamilyTreeRepository.getTreeOverview(treeId, user.id),
    PersonRepository.listActivePeopleByTree(treeId),
    PersonRepository.getDeletedPeopleByTree(treeId),
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
            { label: tree.name, href: `/trees/${tree.id}` },
            { label: "Danh sách nhân vật" },
          ]}
        />

        {tree.canEdit && deletedPeople.length > 0 && (
          <Link
            href={`/trees/${tree.id}/people/trash`}
            className="inline-flex items-center p-1 text-xs font-medium text-neutral-500 transition-colors hover:text-red-700"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Thùng rác nhân vật ({deletedPeople.length})
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Danh Sách Nhân Vật
          </h1>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            Quản lý hồ sơ các thành viên trong cây gia phả "{tree.name}" ({people.length} nhân vật).
          </p>
        </div>

        {tree.canEdit && (
          <div>
            <Button
              asChild
              className="min-h-[44px] w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
            >
              <Link href={`/trees/${tree.id}/people/new`}>
                <UserPlus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Thêm nhân vật
              </Link>
            </Button>
          </div>
        )}
      </div>

      {people.length === 0 ? (
        <EmptyState
          icon={<Users className="h-7 w-7" />}
          title="Chưa có nhân vật nào trong cây gia phả"
          description="Hãy thêm các cụ Tổ, ông bà hoặc thành viên đầu tiên để bắt đầu xây dựng cây phả hệ."
          primaryAction={
            tree.canEdit
              ? {
                  label: "Thêm nhân vật đầu tiên",
                  href: `/trees/${tree.id}/people/new`,
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => {
            const birthDisplay = formatGenealogyDate(
              person.birthDate,
              person.birthYear,
              person.birthDatePrecision,
              person.birthIsEstimated
            );

            return (
              <div
                key={person.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                      {person.gender === "male"
                        ? "Nam"
                        : person.gender === "female"
                          ? "Nữ"
                          : person.gender === "other"
                            ? "Khác"
                            : "Chưa rõ"}
                    </span>

                    <span
                      className={`text-[11px] font-medium ${
                        person.livingStatus === "living"
                          ? "text-emerald-700"
                          : person.livingStatus === "deceased"
                            ? "text-neutral-500"
                            : "text-amber-700"
                      }`}
                    >
                      {person.livingStatus === "living"
                        ? "Còn sống"
                        : person.livingStatus === "deceased"
                          ? "Đã mất"
                          : "Chưa rõ"}
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-sm font-bold text-neutral-900">
                    <Link
                      href={`/trees/${tree.id}/people/${person.id}`}
                      className="rounded hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                    >
                      {person.fullName}
                    </Link>
                  </h3>

                  <div className="mt-1.5 space-y-0.5 text-xs text-neutral-500">
                    <div>Sinh: {birthDisplay}</div>
                    {person.hometownText && (
                      <div className="line-clamp-1">Quê: {person.hometownText}</div>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-end border-t border-neutral-100 pt-3">
                  <Link
                    href={`/trees/${tree.id}/people/${person.id}`}
                    className="inline-flex items-center p-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
