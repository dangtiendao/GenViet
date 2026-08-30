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
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Tìm theo tên nhân vật..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-6 text-sm text-neutral-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang tìm kiếm nhân vật...
        </div>
      ) : candidates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 py-6 text-center text-sm text-neutral-500">
          Không tìm thấy nhân vật nào phù hợp trong cây gia phả.
        </div>
      ) : (
        <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
          {candidates.map((cand) => {
            const isSelected = cand.id === selectedPersonId;
            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => onSelectPerson(cand)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                    : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-neutral-900">{cand.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {cand.gender === "male" ? "Nam" : cand.gender === "female" ? "Nữ" : "Khác"}
                    {cand.birthYear ? ` • Sinh năm ${cand.birthYear}` : ""}
                    {cand.livingStatus === "deceased" ? " • Đã mất" : ""}
                  </div>
                </div>
                {isSelected && <UserCheck className="h-5 w-5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
