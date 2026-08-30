import * as React from "react";
import Link from "next/link";
import {
  User,
  Edit,
  Calendar,
  MapPin,
  Briefcase,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatGenealogyDate } from "../utils/partial-date-mapper";
import { PersonRelationshipList } from "./person-relationship-list";
import type { PersonDetail as PersonDetailType } from "../types/person.types";

const GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  unknown: "Chưa rõ giới tính",
};

const LIVING_STATUS_LABELS: Record<string, string> = {
  living: "Còn sống",
  deceased: "Đã mất",
  unknown: "Chưa rõ tình trạng",
};

const VERIFICATION_LABELS: Record<string, string> = {
  verified: "Đã xác minh",
  unverified: "Chưa xác minh",
  disputed: "Đang tranh chấp",
};

export function PersonDetail({ person }: { person: PersonDetailType }) {
  const birthDisplay = formatGenealogyDate(
    person.birthDate,
    person.birthYear,
    person.birthDatePrecision,
    person.birthIsEstimated
  );

  const deathDisplay = formatGenealogyDate(
    person.deathDate,
    person.deathYear,
    person.deathDatePrecision,
    person.deathIsEstimated
  );

  const genderLabel = GENDER_LABELS[person.gender] || person.gender;
  const livingLabel = LIVING_STATUS_LABELS[person.livingStatus] || person.livingStatus;
  const verifyLabel = VERIFICATION_LABELS[person.verificationStatus] || person.verificationStatus;

  return (
    <div className="max-w-4xl space-y-8">
      {/* 1. HEADER PROFILE CARD */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-800">
              {person.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                  {genderLabel}
                </span>

                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    person.livingStatus === "living"
                      ? "border border-emerald-200/50 bg-emerald-50 text-emerald-700"
                      : person.livingStatus === "deceased"
                        ? "border border-neutral-200 bg-neutral-100 text-neutral-600"
                        : "border border-amber-200/50 bg-amber-50 text-amber-700"
                  }`}
                >
                  {livingLabel}
                </span>

                <span className="inline-flex items-center rounded-md border border-blue-200/50 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  <ShieldCheck className="mr-1 h-3 w-3 text-blue-600" aria-hidden="true" />
                  {verifyLabel}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                {person.fullName}
              </h1>

              {person.occupationText && (
                <p className="flex items-center text-xs text-neutral-600">
                  <Briefcase className="mr-1.5 h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                  {person.occupationText}
                </p>
              )}
            </div>
          </div>

          {person.canEdit && (
            <div className="shrink-0">
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/trees/${person.treeId}/people/${person.id}/edit`}>
                  <Edit className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Chỉnh sửa hồ sơ
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Vital Dates & Location Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-6 text-xs text-neutral-700 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center font-medium text-neutral-500">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Ngày sinh:
            </div>
            <div className="font-semibold text-neutral-900">{birthDisplay}</div>
            {person.birthPlaceText && (
              <div className="text-[11px] text-neutral-500">Nơi sinh: {person.birthPlaceText}</div>
            )}
          </div>

          {person.livingStatus !== "living" && (
            <div className="space-y-1">
              <div className="flex items-center font-medium text-neutral-500">
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                Ngày mất:
              </div>
              <div className="font-semibold text-neutral-900">{deathDisplay}</div>
              {person.burialPlaceText && (
                <div className="text-[11px] text-neutral-500">
                  Mộ phần: {person.burialPlaceText}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center font-medium text-neutral-500">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Quê quán:
            </div>
            <div className="font-semibold text-neutral-900">
              {person.hometownText || "Chưa cập nhật"}
            </div>
          </div>
        </div>

        {/* Biography */}
        {person.biography && (
          <div className="mt-6 space-y-2 border-t border-neutral-100 pt-6">
            <div className="flex items-center text-xs font-bold tracking-wider text-neutral-900 uppercase">
              <BookOpen className="mr-1.5 h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              Tiểu sử phả ký
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-line text-neutral-700">
              {person.biography}
            </p>
          </div>
        )}

        {/* Footer meta */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-[11px] text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Phiên bản: v{person.version}</span>
          </div>

          <div>Cập nhật: {new Date(person.updatedAt).toLocaleDateString("vi-VN")}</div>
        </div>
      </div>

      {/* 2. READ-ONLY RELATIONSHIP SUMMARY */}
      <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Quan hệ gia đình</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Tóm tắt các liên kết cha mẹ, con cái và phối ngẫu trong cùng cây gia phả (Chỉ đọc).
          </p>
        </div>

        <PersonRelationshipList treeId={person.treeId} relationships={person.relationships} />
      </div>
    </div>
  );
}
