"use client";

import React from "react";
import Link from "next/link";
import { Users, Crown, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GraphPersonDto } from "@/features/tree-graph/types/tree-graph.types";

export interface TreeToolbarProps {
  treeId: string;
  centerPerson: GraphPersonDto | null;
  ancestorDepth: number;
  descendantDepth: number;
  isTruncated?: boolean;
  onResetExpansion?: () => void;
}

export function TreeToolbar({
  treeId,
  centerPerson,
  ancestorDepth,
  descendantDepth,
  isTruncated,
  onResetExpansion,
}: TreeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-4 py-2.5 backdrop-blur-xs">
      <div className="flex flex-wrap items-center gap-2">
        {centerPerson && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
            <Crown className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            <span>Tâm điểm:</span>
            <span className="font-bold text-neutral-900">{centerPerson.fullName}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
          <span>Tổ tiên: {ancestorDepth} đời</span>
          <span className="text-neutral-300">•</span>
          <span>Hậu duệ: {descendantDepth} đời</span>
        </div>

        {isTruncated && (
          <div
            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
            title="Đồ thị bị cắt gọt do đạt giới hạn ngân sách"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Đã cắt gọt an toàn</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onResetExpansion && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetExpansion}
            className="h-8 text-xs text-neutral-600 hover:text-neutral-900"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Đặt lại độ sâu
          </Button>
        )}

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href={`/trees/${treeId}/people`}>
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Danh sách nhân vật
          </Link>
        </Button>
      </div>
    </div>
  );
}
