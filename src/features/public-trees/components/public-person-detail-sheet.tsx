"use client";

import * as React from "react";
import {
  X,
  User,
  ShieldCheck,
  Heart,
  GitFork,
  Lock,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicPersonProfileDto } from "../contracts/public-person.dto";

interface PublicPersonDetailSheetProps {
  person: PublicPersonProfileDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPerson?: (personId: string) => void;
}

export function PublicPersonDetailSheet({
  person,
  isOpen,
  onClose,
  onSelectPerson,
}: PublicPersonDetailSheetProps) {
  if (!isOpen || !person) return null;

  const isLiving = person.livingState === "LIVING" || person.livingState === "UNKNOWN";

  return (
    <aside
      role="dialog"
      aria-label="Thông tin nhân vật công khai"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <h2 className="text-base font-bold text-neutral-900">Chi tiết nhân vật</h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
        {/* Profile Card */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shadow-2xs">
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold text-neutral-900">
                {person.displayName}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-600">
                {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Chưa rõ"} •{" "}
                {isLiving ? (
                  <span className="font-medium text-emerald-700">Còn sống</span>
                ) : (
                  <span>Đã mất</span>
                )}
              </p>
            </div>
          </div>

          {isLiving && (
            <div className="mt-3 flex items-start space-x-1.5 rounded-lg border border-emerald-200 bg-white p-2.5 text-xs text-emerald-900">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <span>
                Thông tin cá nhân chi tiết (ngày sinh đầy đủ, nơi sinh, liên hệ) đã được ẩn theo
                chính sách bảo vệ quyền riêng tư.
              </span>
            </div>
          )}
        </div>

        {/* Life dates */}
        <div className="space-y-2">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-neutral-600" /> Năm sinh / Năm mất
          </h4>
          <div className="space-y-1.5 rounded-xl border border-neutral-200 bg-neutral-50/80 p-3 text-xs text-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Năm sinh:</span>
              <span className="font-semibold">
                {person.birthYear
                  ? `Năm ${person.birthYear}`
                  : isLiving
                    ? "Còn sống (Đã ẩn năm)"
                    : "Chưa rõ"}
              </span>
            </div>
            {!isLiving ? (
              <div className="flex items-center justify-between border-t border-neutral-200/60 pt-1">
                <span className="text-neutral-500">Năm mất:</span>
                <span className="font-semibold">
                  {person.deathYear ? `Năm ${person.deathYear}` : "Chưa rõ"}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Parents */}
        <div className="space-y-2">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
            <GitFork className="mr-1.5 h-3.5 w-3.5 text-emerald-700" /> Cha Mẹ
          </h4>
          <div className="space-y-1.5">
            {person.father ? (
              <button
                type="button"
                onClick={() => onSelectPerson?.(person.father!.id)}
                className="group flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50"
              >
                <span>
                  Cha: <strong className="text-neutral-900">{person.father.displayName}</strong>
                </span>
                <span className="flex items-center text-[10px] text-emerald-700 transition-transform group-hover:translate-x-0.5">
                  Xem <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </span>
              </button>
            ) : (
              <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs text-neutral-400 italic">
                Chưa có thông tin cha
              </p>
            )}

            {person.mother ? (
              <button
                type="button"
                onClick={() => onSelectPerson?.(person.mother!.id)}
                className="group flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50"
              >
                <span>
                  Mẹ: <strong className="text-neutral-900">{person.mother.displayName}</strong>
                </span>
                <span className="flex items-center text-[10px] text-emerald-700 transition-transform group-hover:translate-x-0.5">
                  Xem <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </span>
              </button>
            ) : (
              <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs text-neutral-400 italic">
                Chưa có thông tin mẹ
              </p>
            )}
          </div>
        </div>

        {/* Spouses */}
        {person.spouses && person.spouses.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <Heart className="mr-1.5 h-3.5 w-3.5 text-rose-500" />{" "}
              {person.gender === "male"
                ? `Vợ (${person.spouses.length})`
                : person.gender === "female"
                  ? `Chồng (${person.spouses.length})`
                  : `Vợ / Chồng (${person.spouses.length})`}
            </h4>
            <div className="space-y-1.5">
              {person.spouses.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onSelectPerson?.(sp.id)}
                  className="group flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-rose-400 hover:bg-rose-50/40"
                >
                  <span>
                    {person.gender === "male"
                      ? "Vợ:"
                      : person.gender === "female"
                        ? "Chồng:"
                        : "Vợ / Chồng:"}{" "}
                    <strong className="text-neutral-900">{sp.displayName}</strong>
                  </span>
                  <span className="flex items-center text-[10px] text-rose-600 transition-transform group-hover:translate-x-0.5">
                    Xem <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Siblings */}
        {person.siblings && person.siblings.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <Users className="mr-1.5 h-3.5 w-3.5 text-blue-600" /> Anh / Chị / Em ruột (
              {person.siblings.length})
            </h4>
            <div className="max-h-36 space-y-1.5 overflow-y-auto">
              {person.siblings.map((sib) => (
                <button
                  key={sib.id}
                  type="button"
                  onClick={() => onSelectPerson?.(sib.id)}
                  className="group flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-blue-400 hover:bg-blue-50/40"
                >
                  <span className="truncate">{sib.displayName}</span>
                  <span className="flex shrink-0 items-center text-[10px] text-blue-600 transition-transform group-hover:translate-x-0.5">
                    Xem <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {person.children && person.children.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <User className="mr-1.5 h-3.5 w-3.5 text-emerald-700" /> Con cái (
              {person.children.length})
            </h4>
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {person.children.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onSelectPerson?.(ch.id)}
                  className="group flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-800 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50"
                >
                  <span className="truncate">{ch.displayName}</span>
                  <span className="flex shrink-0 items-center text-[10px] text-emerald-700 transition-transform group-hover:translate-x-0.5">
                    Xem <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Notice */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-4 text-center text-xs text-neutral-500">
        Chế độ xem chỉ đọc dành cho khách
      </div>
    </aside>
  );
}
