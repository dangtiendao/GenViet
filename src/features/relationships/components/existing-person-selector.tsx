"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, Loader2, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCandidatesAction } from "../actions/relationship.actions";
import type { RelatedPersonCandidate } from "../types/relationship.types";

export function ExistingPersonSelector({
  treeId,
  excludePersonId,
  onSelectPerson,
  selectedPersonId,
}: {
  treeId: string;
  excludePersonId: string;
  onSelectPerson: (candidate: RelatedPersonCandidate) => void;
  selectedPersonId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<RelatedPersonCandidate[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await searchCandidatesAction(treeId, excludePersonId, query);
      if (res.success && res.candidates) {
        setCandidates(res.candidates);
      }
    });
  }, [treeId, excludePersonId, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Tìm theo tên nhân vật trong cây..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 rounded-lg pl-10 text-sm"
        />
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-8 text-sm text-neutral-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
          Đang tìm kiếm nhân vật...
        </div>
      ) : candidates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-500">
          Không tìm thấy nhân vật nào phù hợp trong cây gia phả.
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {candidates.map((cand) => {
            const isSelected = cand.id === selectedPersonId;
            const isMale = cand.gender === "male";
            const isFemale = cand.gender === "female";

            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => onSelectPerson(cand)}
                className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/40"
                    : "border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isMale
                        ? "bg-blue-100 text-blue-700"
                        : isFemale
                          ? "bg-pink-100 text-pink-700"
                          : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {cand.fullName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{cand.fullName}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      {isMale ? "Nam" : isFemale ? "Nữ" : "Khác"}
                      {cand.birthYear ? ` • Sinh năm ${cand.birthYear}` : ""}
                      {cand.livingStatus === "deceased" ? " • Đã mất" : " • Còn sống"}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <UserCheck className="h-4 w-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
