"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestorePersonDialog } from "./restore-person-dialog";
import { formatGenealogyDate } from "../utils/partial-date-mapper";
import type { PersonListItem } from "../types/person.types";

export function TrashPersonRow({ treeId, person }: { treeId: string; person: PersonListItem }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const birthDisplay = formatGenealogyDate(
    person.birthDate,
    person.birthYear,
    person.birthDatePrecision,
    person.birthIsEstimated
  );

  return (
    <>
      <div className="flex flex-col gap-2.5 rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-neutral-900">{person.fullName}</span>
            <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
              {person.gender === "male"
                ? "Nam"
                : person.gender === "female"
                  ? "Nữ"
                  : person.gender === "other"
                    ? "Khác"
                    : "Chưa rõ"}
            </span>
          </div>

          <div className="mt-1 space-x-2 text-xs text-neutral-500">
            <span>Sinh: {birthDisplay}</span>
            {person.hometownText && <span>• Quê: {person.hometownText}</span>}
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
            className="min-h-[38px] w-full text-xs text-emerald-700 hover:bg-emerald-50 sm:w-auto"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Khôi phục hồ sơ
          </Button>
        </div>
      </div>

      <RestorePersonDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        treeId={treeId}
        personId={person.id}
        personName={person.fullName}
        version={person.version}
      />
    </>
  );
}
