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
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
            Xem trước quan hệ
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            {badge.label}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-white p-3 shadow-xs">
          <div className="text-sm font-medium text-neutral-800">{preview.relatedPersonName}</div>
          <ArrowRight className="h-4 w-4 text-emerald-600" />
          <div className="text-sm font-medium text-neutral-800">{preview.subjectPersonName}</div>
        </div>

        <p className="mt-3 text-sm text-neutral-700">{preview.summaryText}</p>
      </div>

      {warningMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-xs">
            <div className="font-semibold">Cảnh báo phả hệ</div>
            <div>{warningMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div className="text-xs">
            <div className="font-semibold">Không thể thiết lập quan hệ</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}
