"use client";

import { AlertTriangle, ShieldAlert, ArrowRight, UserPlus, Link2 } from "lucide-react";
import type { RelationshipPreviewData } from "../types/relationship.types";
import { getVerificationStatusBadge } from "../utils/relationship-preview";

export function RelationshipPreviewCard({
  preview,
  warningMessage,
  errorMessage,
}: {
  preview: RelationshipPreviewData;
  warningMessage?: string | null;
  errorMessage?: string | null;
}) {
  const badge = getVerificationStatusBadge(preview.verificationStatus);

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Xem trước quan hệ phả hệ
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-300/60 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            {badge.label}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-neutral-200/60 bg-white p-3.5 shadow-xs">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-neutral-500">Đối tượng liên quan</div>
            <div className="truncate text-sm font-bold text-neutral-900">
              {preview.relatedPersonName}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-full bg-emerald-100 p-2 text-emerald-700">
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="text-xs font-medium text-neutral-500">Nhân vật trung tâm</div>
            <div className="truncate text-sm font-bold text-neutral-900">
              {preview.subjectPersonName}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed font-medium text-neutral-700">
          {preview.summaryText}
        </p>
      </div>

      {warningMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-amber-900 shadow-xs">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-xs leading-relaxed">
            <div className="text-sm font-bold text-amber-900">Cảnh báo phả hệ</div>
            <div className="mt-0.5">{warningMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-rose-900 shadow-xs">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div className="text-xs leading-relaxed">
            <div className="text-sm font-bold text-rose-900">Không thể thiết lập quan hệ</div>
            <div className="mt-0.5">{errorMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}
