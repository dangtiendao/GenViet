"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GitFork, ChevronDown, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FamilyTreeListItem } from "../types/family-tree.types";

export function FamilyTreeSwitcher({
  currentTreeId,
  trees,
}: {
  currentTreeId?: string;
  trees: FamilyTreeListItem[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const currentTree = trees.find((t) => t.id === currentTreeId);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (trees.length === 0) return null;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[44px] items-center space-x-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Chọn cây gia phả"
      >
        <GitFork className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        <span className="max-w-[160px] truncate sm:max-w-[200px]">
          {currentTree ? currentTree.name : "Chọn cây gia phả"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-1.5 w-64 origin-top-left rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl transition-all"
        >
          <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Cây gia phả ({trees.length})
          </div>

          <div className="max-h-60 space-y-0.5 overflow-y-auto">
            {trees.map((tree) => {
              const isSelected = tree.id === currentTreeId;

              return (
                <button
                  key={tree.id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/trees/${tree.id}`);
                  }}
                  className={cn(
                    "flex min-h-[40px] w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-neutral-100",
                    isSelected ? "bg-emerald-50 font-semibold text-emerald-900" : "text-neutral-700"
                  )}
                  role="menuitem"
                >
                  <span className="truncate pr-2">{tree.name}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 border-t border-neutral-100 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/trees/new");
              }}
              className="flex min-h-[40px] w-full items-center space-x-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              role="menuitem"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tạo cây gia phả mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
