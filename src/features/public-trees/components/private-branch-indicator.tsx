import * as React from "react";
import { Shield, GitBranch, ArrowDownCircle } from "lucide-react";
import type { PublicHiddenReason } from "../contracts/public-hidden-reason";

interface PrivateBranchIndicatorProps {
  reason: PublicHiddenReason;
  className?: string;
}

export function PrivateBranchIndicator({ reason, className = "" }: PrivateBranchIndicatorProps) {
  if (!reason) return null;

  if (reason === "PRIVACY") {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 shadow-2xs ${className}`}
        title="Nhánh bị ẩn để bảo vệ quyền riêng tư"
      >
        <Shield className="h-3 w-3 text-amber-600" aria-hidden="true" />
        <span>Nhánh riêng tư</span>
      </div>
    );
  }

  if (reason === "PATERNAL_LINE") {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 shadow-2xs ${className}`}
        title="Dòng ngoại tộc (Hiển thị theo chế độ dòng họ nội tộc)"
      >
        <GitBranch className="h-3 w-3 text-neutral-500" aria-hidden="true" />
        <span>Ngoại tộc</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500 shadow-2xs ${className}`}
    >
      <ArrowDownCircle className="h-3 w-3 text-neutral-400" aria-hidden="true" />
      <span>Thu gọn</span>
    </div>
  );
}
