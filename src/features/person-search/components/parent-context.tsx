import React from "react";
import { Users } from "lucide-react";
import type { ParentSummary } from "../types/person-search.types";

export interface ParentContextProps {
  parents: ParentSummary[];
}

export function ParentContext({ parents }: ParentContextProps) {
  if (!parents || parents.length === 0) {
    return (
      <div className="flex items-center text-xs text-neutral-400 italic">
        <Users className="mr-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Chưa có thông tin cha mẹ</span>
      </div>
    );
  }

  const fathers = parents.filter((p) => p.parentRole === "father");
  const mothers = parents.filter((p) => p.parentRole === "mother");
  const others = parents.filter((p) => p.parentRole !== "father" && p.parentRole !== "mother");

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
      <Users className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />

      {fathers.length > 0 && (
        <div className="inline-flex items-center gap-1">
          <span className="font-medium text-neutral-700">Cha:</span>
          <span>{fathers.map((f) => f.fullName).join(", ")}</span>
        </div>
      )}

      {mothers.length > 0 && (
        <div className="inline-flex items-center gap-1">
          <span className="font-medium text-neutral-700">Mẹ:</span>
          <span>{mothers.map((m) => m.fullName).join(", ")}</span>
        </div>
      )}

      {others.length > 0 && (
        <div className="inline-flex items-center gap-1">
          <span className="font-medium text-neutral-700">Người đỡ đầu:</span>
          <span>{others.map((o) => o.fullName).join(", ")}</span>
        </div>
      )}
    </div>
  );
}
