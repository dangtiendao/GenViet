"use client";

import React from "react";
import Link from "next/link";
import { Crown, User, ArrowRight } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import type { GraphPersonDto } from "@/features/tree-graph/types/tree-graph.types";

export interface PersonDetailSheetProps {
  person: GraphPersonDto | null;
  isOpen: boolean;
  treeId: string;
  isCenter: boolean;
  onClose: () => void;
  onChangeCenter?: (personId: string) => void;
}

export function PersonDetailSheet({
  person,
  isOpen,
  treeId,
  isCenter,
  onClose,
  onChangeCenter,
}: PersonDetailSheetProps) {
  if (!person) return null;

  const isDeceased = person.livingStatus === "deceased";
  const birthText = person.birthYear ? String(person.birthYear) : "Chưa rõ";
  const deathText = isDeceased ? (person.deathYear ? String(person.deathYear) : "Chưa rõ") : "";

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={person.fullName}>
      <div className="space-y-4">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600">
          <div>
            <span className="font-semibold text-neutral-800">Năm sinh:</span> {birthText}
          </div>
          <div>
            <span className="font-semibold text-neutral-800">Trạng thái:</span>{" "}
            {isDeceased ? `Đã mất (${deathText})` : "Còn sống"}
          </div>
          <div>
            <span className="font-semibold text-neutral-800">Giới tính:</span>{" "}
            {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Khác"}
          </div>
          <div>
            <span className="font-semibold text-neutral-800">Xác thực:</span>{" "}
            {person.verificationStatus === "verified"
              ? "Đã xác minh"
              : person.verificationStatus === "disputed"
                ? "Tranh chấp"
                : "Chưa xác minh"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {!isCenter && onChangeCenter && (
            <Button
              type="button"
              className="min-h-[44px] w-full justify-center"
              onClick={() => {
                onChangeCenter(person.id);
                onClose();
              }}
            >
              <Crown className="mr-2 h-4 w-4 text-amber-300" />
              Đặt làm nhân vật trung tâm
            </Button>
          )}

          <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
            <Link href={`/trees/${treeId}/people/${person.id}`}>
              <User className="mr-2 h-4 w-4 text-neutral-500" />
              Xem hồ sơ chi tiết
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
