"use client";

import { useState, useRef, useEffect } from "react";

import { UserPlus, Users, Heart, PlusCircle, MoreVertical, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddRelativeDialog } from "./add-relative-dialog";
import type { RelationActionType } from "../types/relationship.types";

export function RelationshipActionMenu({
  treeId,
  personId,
  personName,
  canWrite,
  variant = "button",
  onSuccess,
}: {
  treeId: string;
  personId: string;
  personName: string;
  canWrite: boolean;
  variant?: "button" | "icon";
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<RelationActionType | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Tự động đóng dropdown khi click ra ngoài hoặc nhấn phím Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
    document.addEventListener("keydown", handleKeyDown, true);

    // Nâng z-index của thẻ node cha trong React Flow lên cao nhất để không bị các node khác che
    const nodeWrapper = menuRef.current?.closest<HTMLElement>(".react-flow__node");
    const prevZIndex = nodeWrapper ? nodeWrapper.style.zIndex : "";
    if (nodeWrapper) {
      nodeWrapper.style.zIndex = "1000";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      if (nodeWrapper) {
        nodeWrapper.style.zIndex = prevZIndex;
      }
    };
  }, [isOpen]);

  if (!canWrite) {
    return null;
  }

  const handleOpenAction = (action: RelationActionType) => {
    setActiveAction(action);
    setIsOpen(false);
  };

  return (
    <>
      <div ref={menuRef} className="relative inline-block text-left">
        {variant === "icon" ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label={`Thao tác cho ${personName}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        ) : (
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
        )}

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 focus:outline-hidden">
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
              onClick={() => handleOpenAction("add_sibling")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Thêm Anh / Chị / Em</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAction("add_child")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <PlusCircle className="h-4 w-4 text-emerald-600" />
              <span>Thêm Con</span>
            </button>
          </div>
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
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
