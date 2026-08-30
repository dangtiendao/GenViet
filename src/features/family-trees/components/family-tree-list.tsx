import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FamilyTreeCard } from "./family-tree-card";
import { FamilyTreeEmptyState } from "./family-tree-empty-state";
import type { FamilyTreeListItem } from "../types/family-tree.types";

export function FamilyTreeList({ trees }: { trees: FamilyTreeListItem[] }) {
  if (!trees || trees.length === 0) {
    return <FamilyTreeEmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Cây Gia Phả Của Bạn
          </h1>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            Quản lý và tra cứu các dòng họ bạn có quyền truy cập ({trees.length} cây).
          </p>
        </div>

        <div>
          <Button
            asChild
            className="min-h-[44px] w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
          >
            <Link href="/trees/new">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Tạo cây mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trees.map((tree) => (
          <FamilyTreeCard key={tree.id} tree={tree} />
        ))}
      </div>
    </div>
  );
}
