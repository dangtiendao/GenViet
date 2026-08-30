"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Crown, User, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GraphPersonDto } from "@/features/tree-graph/types/tree-graph.types";

export interface PersonDetailPanelProps {
  person: GraphPersonDto | null;
  isOpen: boolean;
  treeId: string;
  isCenter: boolean;
  onClose: () => void;
  onChangeCenter?: (personId: string) => void;
}

export function PersonDetailPanel({
  person,
  isOpen,
  treeId,
  isCenter,
  onClose,
  onChangeCenter,
}: PersonDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !person) return null;

  const isDeceased = person.livingStatus === "deceased";
  const birthText = person.birthYear ? String(person.birthYear) : "Chưa rõ";
  const deathText = isDeceased ? (person.deathYear ? String(person.deathYear) : "Chưa rõ") : "";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={`Chi tiết nhân vật: ${person.fullName}`}
      className="animate-in fade-in slide-in-from-right-4 absolute top-16 right-4 z-20 w-80 rounded-2xl border border-neutral-200 bg-white/95 p-5 shadow-xl backdrop-blur-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-neutral-900">{person.fullName}</h3>
            {isCenter && <Crown className="h-4 w-4 text-amber-500" aria-label="Tâm điểm đồ thị" />}
          </div>
          <p className="text-xs text-neutral-500">
            {isDeceased ? `Đã mất (${birthText} - ${deathText})` : `Còn sống (Sinh ${birthText})`}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng bảng chi tiết"
          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {/* Verification status indicator */}
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-2.5 text-xs">
          {person.verificationStatus === "verified" ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-800">Hồ sơ đã được xác minh</span>
            </>
          ) : person.verificationStatus === "disputed" ? (
            <>
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span className="font-medium text-rose-800">Đang có tranh chấp thông tin</span>
            </>
          ) : (
            <>
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">Thông tin chưa được xác minh</span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          {!isCenter && onChangeCenter && (
            <Button
              type="button"
              className="min-h-[40px] w-full justify-center text-xs"
              onClick={() => {
                onChangeCenter(person.id);
                onClose();
              }}
            >
              <Crown className="mr-2 h-4 w-4 text-amber-300" />
              Đặt làm nhân vật trung tâm
            </Button>
          )}

          <Button asChild variant="outline" className="min-h-[40px] w-full justify-center text-xs">
            <Link href={`/trees/${treeId}/people/${person.id}`}>
              <User className="mr-2 h-4 w-4 text-neutral-500" />
              Xem hồ sơ cá nhân
              <ArrowRight className="ml-auto h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
