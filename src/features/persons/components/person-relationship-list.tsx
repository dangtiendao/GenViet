"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Heart, ArrowUpRight, Trash2, HeartCrack } from "lucide-react";
import type { PersonRelationshipSummary } from "../types/person.types";
import { DeleteRelationshipDialog } from "@/features/relationships/components/delete-relationship-dialog";
import { EndUnionDialog } from "@/features/relationships/components/end-union-dialog";

const PARENT_ROLE_LABELS: Record<string, string> = {
  father: "Cha",
  mother: "Mẹ",
  unspecified: "Cha/Mẹ",
};

const UNION_STATUS_LABELS: Record<string, string> = {
  active: "Hôn nhân hiện tại",
  separated: "Ly thân",
  divorced: "Đã ly hôn",
  widowed: "Góa",
  former: "Cựu phối ngẫu",
};

export function PersonRelationshipList({
  treeId,
  personId,
  canWrite = false,
  relationships,
}: {
  treeId: string;
  personId: string;
  canWrite?: boolean;
  relationships: PersonRelationshipSummary;
}) {
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "relationship" | "union";
    id: string;
    name: string;
    version: number;
  } | null>(null);

  const [endUnionTarget, setEndUnionTarget] = React.useState<{
    unionId: string;
    partnerName: string;
    version: number;
  } | null>(null);

  const hasParents = relationships.parents.length > 0;
  const hasChildren = relationships.children.length > 0;
  const hasSpouses = relationships.spouses.length > 0;
  const hasAny = hasParents || hasChildren || hasSpouses;

  if (!hasAny) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-6 text-center">
        <Users className="mx-auto mb-2 h-8 w-8 text-neutral-400" aria-hidden="true" />
        <h4 className="text-xs font-semibold text-neutral-800">Chưa có liên kết quan hệ</h4>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          Nhân vật này chưa được liên kết với cha mẹ, con cái hoặc vợ chồng. Sử dụng nút &quot;Thêm
          người thân&quot; để thiết lập quan hệ.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 1. CHA / MẸ */}
        <div className="space-y-2.5">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-900 uppercase">
            <Users className="mr-1.5 h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            Cha / Mẹ ({relationships.parents.length})
          </h4>

          {hasParents ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {relationships.parents.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs transition-colors hover:border-emerald-300"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-flex items-center rounded border border-emerald-200/50 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {PARENT_ROLE_LABELS[item.parentRole] || item.parentRole}
                      </span>
                      <Link
                        href={`/trees/${treeId}/people/${item.parent.id}`}
                        className="inline-flex items-center rounded text-xs font-semibold text-neutral-900 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      >
                        {item.parent.fullName}
                        <ArrowUpRight
                          className="ml-0.5 h-3 w-3 text-neutral-400"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      {item.parent.birthYear ? `Sinh ${item.parent.birthYear}` : "Năm sinh chưa rõ"}
                      {item.parent.deathYear ? ` - Mất ${item.parent.deathYear}` : ""}
                    </div>
                  </div>

                  {canWrite && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: "relationship",
                          id: item.id,
                          name: item.parent.fullName,
                          version: 1,
                        })
                      }
                      className="rounded p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Gỡ quan hệ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">Chưa có thông tin cha mẹ.</p>
          )}
        </div>

        {/* 2. VỢ / CHỒNG (PHỐI NGẪU) */}
        <div className="space-y-2.5">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-900 uppercase">
            <Heart className="mr-1.5 h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
            Vợ / Chồng ({relationships.spouses.length})
          </h4>

          {hasSpouses ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {relationships.spouses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs transition-colors hover:border-rose-300"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-flex items-center rounded border border-rose-200/50 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800">
                        {UNION_STATUS_LABELS[item.unionStatus] || "Phối ngẫu"}
                      </span>
                      <Link
                        href={`/trees/${treeId}/people/${item.spouse.id}`}
                        className="inline-flex items-center rounded text-xs font-semibold text-neutral-900 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      >
                        {item.spouse.fullName}
                        <ArrowUpRight
                          className="ml-0.5 h-3 w-3 text-neutral-400"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      {item.spouse.birthYear ? `Sinh ${item.spouse.birthYear}` : "Năm sinh chưa rõ"}
                      {item.spouse.deathYear ? ` - Mất ${item.spouse.deathYear}` : ""}
                    </div>
                  </div>

                  {canWrite && (
                    <div className="flex items-center gap-1">
                      {item.unionStatus === "active" && (
                        <button
                          type="button"
                          onClick={() =>
                            setEndUnionTarget({
                              unionId: item.id,
                              partnerName: item.spouse.fullName,
                              version: 1,
                            })
                          }
                          className="rounded p-1.5 text-neutral-400 hover:bg-amber-50 hover:text-amber-700"
                          title="Kết thúc hôn nhân"
                        >
                          <HeartCrack className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            type: "union",
                            id: item.id,
                            name: item.spouse.fullName,
                            version: 1,
                          })
                        }
                        className="rounded p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa liên kết hôn nhân"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">Chưa có thông tin phối ngẫu.</p>
          )}
        </div>

        {/* 3. CON CÁI */}
        <div className="space-y-2.5">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-900 uppercase">
            <Users className="mr-1.5 h-3.5 w-3.5 text-blue-700" aria-hidden="true" />
            Con cái ({relationships.children.length})
          </h4>

          {hasChildren ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {relationships.children.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs transition-colors hover:border-blue-300"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-flex items-center rounded border border-blue-200/50 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                        {item.child.gender === "male"
                          ? "Con trai"
                          : item.child.gender === "female"
                            ? "Con gái"
                            : "Con"}
                      </span>
                      <Link
                        href={`/trees/${treeId}/people/${item.child.id}`}
                        className="inline-flex items-center rounded text-xs font-semibold text-neutral-900 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      >
                        {item.child.fullName}
                        <ArrowUpRight
                          className="ml-0.5 h-3 w-3 text-neutral-400"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      {item.child.birthYear ? `Sinh ${item.child.birthYear}` : "Năm sinh chưa rõ"}
                      {item.child.deathYear ? ` - Mất ${item.child.deathYear}` : ""}
                    </div>
                  </div>

                  {canWrite && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: "relationship",
                          id: item.id,
                          name: item.child.fullName,
                          version: 1,
                        })
                      }
                      className="rounded p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Gỡ quan hệ con"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">Chưa có thông tin con cái.</p>
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteRelationshipDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          treeId={treeId}
          personId={personId}
          targetType={deleteTarget.type}
          targetId={deleteTarget.id}
          targetName={deleteTarget.name}
          expectedVersion={deleteTarget.version}
        />
      )}

      {endUnionTarget && (
        <EndUnionDialog
          isOpen={Boolean(endUnionTarget)}
          onClose={() => setEndUnionTarget(null)}
          treeId={treeId}
          personId={personId}
          unionId={endUnionTarget.unionId}
          partnerName={endUnionTarget.partnerName}
          expectedVersion={endUnionTarget.version}
        />
      )}
    </>
  );
}
