"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestoreFamilyTreeDialog } from "@/features/family-trees/components/restore-family-tree-dialog";

export function RestoreTrashItemButton({ treeId, treeName }: { treeId: string; treeName: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="min-h-[44px] text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
        Khôi phục
      </Button>

      <RestoreFamilyTreeDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        treeId={treeId}
        treeName={treeName}
      />
    </>
  );
}
