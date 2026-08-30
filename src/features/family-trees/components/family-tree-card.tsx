import * as React from "react";
import Link from "next/link";
import { GitFork, Shield, Users, ArrowRight, Lock, Globe } from "lucide-react";
import type { FamilyTreeListItem } from "../types/family-tree.types";

const ROLE_LABELS: Record<string, string> = {
  owner: "Chủ sở hữu",
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  viewer: "Người xem",
};

export function FamilyTreeCard({ tree }: { tree: FamilyTreeListItem }) {
  const roleLabel = ROLE_LABELS[tree.role] || tree.role;
  const isPrivate = tree.privacyLevel === "private";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <span className="inline-flex items-center rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
            <Shield className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            {roleLabel}
          </span>

          <span
            className="inline-flex items-center text-[11px] font-medium text-neutral-500"
            title={isPrivate ? "Chỉ thành viên mới xem được" : "Công khai"}
          >
            {isPrivate ? (
              <>
                <Lock className="mr-1 h-3 w-3 text-neutral-400" aria-hidden="true" />
                Riêng tư
              </>
            ) : (
              <>
                <Globe className="mr-1 h-3 w-3 text-blue-500" aria-hidden="true" />
                Công khai
              </>
            )}
          </span>
        </div>

        {/* Tree Title */}
        <h3 className="line-clamp-1 text-base font-bold text-neutral-900">
          <Link
            href={`/trees/${tree.id}`}
            className="rounded hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            {tree.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 min-h-[32px] text-xs leading-relaxed text-neutral-600">
          {tree.description || "Chưa có mô tả cho cây gia phả này."}
        </p>
      </div>

      {/* Footer link */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
        <span className="text-[11px] text-neutral-400">
          Cập nhật: {new Date(tree.updatedAt).toLocaleDateString("vi-VN")}
        </span>

        <Link
          href={`/trees/${tree.id}`}
          className="inline-flex min-h-[44px] items-center p-1 font-medium text-emerald-700 hover:text-emerald-800"
          aria-label={`Xem chi tiết cây gia phả ${tree.name}`}
        >
          Xem chi tiết
          <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
