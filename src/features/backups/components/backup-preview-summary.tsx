import React from "react";
import { Users, GitFork, Heart, Image as ImageIcon, Shield, Lock } from "lucide-react";
import type { BackupImportPreviewDto } from "../types/backup.types";

export interface BackupPreviewSummaryProps {
  preview: BackupImportPreviewDto;
}

export function BackupPreviewSummary({ preview }: BackupPreviewSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Tree Info Header */}
      <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="block text-xs text-neutral-500">Tên cây nguồn:</span>
            <span className="text-sm font-bold text-neutral-900">{preview.sourceTreeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
              <Shield className="h-3 w-3" />
              Schema v{preview.schemaVersion}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
              <Lock className="h-3 w-3" />
              Riêng tư (Private)
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200/60 pt-2 text-xs text-neutral-600">
          Cây gia phả mới sẽ được tạo với tên:{" "}
          <strong className="text-emerald-800">{preview.estimatedNewTreeName}</strong>. Bạn sẽ là
          Chủ sở hữu (Owner) duy nhất.
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-neutral-500">
            <Users className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-medium">Nhân vật</span>
          </div>
          <span className="text-lg font-bold text-neutral-900">{preview.personCount}</span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-neutral-500">
            <GitFork className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium">Quan hệ cha-con</span>
          </div>
          <span className="text-lg font-bold text-neutral-900">{preview.relationshipCount}</span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-neutral-500">
            <Heart className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-medium">Hôn nhân</span>
          </div>
          <span className="text-lg font-bold text-neutral-900">{preview.unionCount}</span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
          <div className="mb-1 flex items-center gap-2 text-neutral-500">
            <ImageIcon className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium">Ảnh metadata</span>
          </div>
          <span className="text-lg font-bold text-neutral-900">{preview.mediaCount}</span>
        </div>
      </div>
    </div>
  );
}
