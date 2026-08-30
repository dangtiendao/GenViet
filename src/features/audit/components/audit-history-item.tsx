import React, { useState } from "react";
import {
  Clock,
  User,
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
  Link2,
  Unlink2,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AuditDiffSummary } from "./audit-diff-summary";
import type { AuditLogDto, AuditActionType } from "../types/audit.types";

export interface AuditHistoryItemProps {
  log: AuditLogDto;
}

function getActionIcon(actionType: AuditActionType) {
  switch (actionType) {
    case "create":
      return <PlusCircle className="h-4 w-4 text-emerald-600" />;
    case "update":
      return <Edit className="h-4 w-4 text-blue-600" />;
    case "soft_delete":
      return <Trash2 className="h-4 w-4 text-rose-600" />;
    case "restore":
      return <RotateCcw className="h-4 w-4 text-emerald-600" />;
    case "link":
      return <Link2 className="h-4 w-4 text-indigo-600" />;
    case "unlink":
      return <Unlink2 className="h-4 w-4 text-amber-600" />;
    case "privacy_change":
      return <Shield className="h-4 w-4 text-purple-600" />;
    default:
      return <Clock className="h-4 w-4 text-neutral-500" />;
  }
}

function getActionBadgeStyle(actionType: AuditActionType) {
  switch (actionType) {
    case "create":
    case "restore":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "update":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "soft_delete":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "link":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "unlink":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "privacy_change":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

export function AuditHistoryItem({ log }: AuditHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(log.createdAt));

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs transition-all hover:border-neutral-300">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Entity & Action Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50">
            {getActionIcon(log.actionType)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{log.entityTypeLabel}</span>
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getActionBadgeStyle(
                  log.actionType
                )}`}
              >
                {log.actionTypeLabel}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {log.actorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Clock className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action button: Toggle diff details */}
        {log.actionType === "update" && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 self-start text-xs font-medium text-emerald-700 transition-colors hover:text-emerald-800 sm:self-center"
          >
            {isExpanded ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Xem chi tiết</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Diff / Summary Content */}
      <div className="mt-3 border-t border-neutral-100 pt-2.5">
        {log.actionType === "update" ? (
          isExpanded ? (
            <AuditDiffSummary log={log} />
          ) : (
            <div className="text-xs text-neutral-500">
              Đã thay đổi các trường:{" "}
              <span className="font-medium text-neutral-700">
                {log.changedFields.join(", ") || "—"}
              </span>
            </div>
          )
        ) : (
          <AuditDiffSummary log={log} />
        )}
      </div>
    </div>
  );
}
