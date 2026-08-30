"use client";

import { useState } from "react";
import { UserPlus, Users, Heart, PlusCircle, MoreVertical, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRelativeDialog } from "./add-relative-dialog";
import type { RelationActionType } from "../types/relationship.types";

export function RelationshipActionMenu({
  treeId,
  personId,
  personName,
  canWrite,
}: {
  treeId: string;
  personId: string;
  personName: string;
  canWrite: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<RelationActionType | null>(null);

  if (!canWrite) {
    return null;
  }

  const handleOpenAction = (action: RelationActionType) => {
    setActiveAction(action);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <UserPlus className="h-4 w-4" />
          <span>Thêm người thân</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-hidden">
              <div className="px-2 py-1.5 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                Thêm quan hệ
              </div>
              <button
                type="button"
                onClick={() => handleOpenAction("add_father")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Users className="h-4 w-4 text-sky-600" />
                <span>Thêm Cha</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAction("add_mother")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Users className="h-4 w-4 text-pink-600" />
                <span>Thêm Mẹ</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAction("add_adoptive_parent")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Users className="h-4 w-4 text-amber-600" />
                <span>Thêm Cha/Mẹ nuôi</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAction("add_spouse")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Heart className="h-4 w-4 text-rose-600" />
                <span>Thêm Vợ/Chồng (Kết đôi)</span>
              </button>
              <div className="my-1 border-t border-neutral-100" />
              <button
                type="button"
                onClick={() => handleOpenAction("add_child")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <PlusCircle className="h-4 w-4 text-emerald-600" />
                <span>Thêm Con</span>
              </button>
            </div>
          </>
        )}
      </div>

      {activeAction && (
        <AddRelativeDialog
          isOpen={Boolean(activeAction)}
          onClose={() => setActiveAction(null)}
          treeId={treeId}
          subjectPersonId={personId}
          subjectPersonName={personName}
          actionType={activeAction}
        />
      )}
    </>
  );
}
