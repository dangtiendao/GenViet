"use client";

import * as React from "react";
import { X, User, ShieldCheck, Heart, GitFork, Lock, Calendar } from "lucide-react";
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
      <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
        {/* Profile Card */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">{person.displayName}</h3>
              <p className="text-xs text-neutral-500 capitalize">
                {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Chưa rõ"} •{" "}
                {isLiving ? "Còn sống" : "Đã mất"}
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
                Thông tin cá nhân chi tiết (ngày sinh đầy đủ, nơi sinh, liên hệ) đã được ẩn để bảo
                vệ quyền riêng tư.
              </span>
            </div>
          )}
        </div>

        {/* Life dates */}
        <div className="space-y-2">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
            <Calendar className="mr-1.5 h-3.5 w-3.5" /> Năm sinh / Năm mất
          </h4>
          <div className="space-y-1 rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-800">
            <p>
              <span className="font-semibold text-neutral-600">Năm sinh:</span>{" "}
              {person.birthYear ? `Năm ${person.birthYear}` : isLiving ? "Đã ẩn" : "Chưa rõ"}
            </p>
            {!isLiving && (
              <p>
                <span className="font-semibold text-neutral-600">Năm mất:</span>{" "}
                {person.deathYear ? `Năm ${person.deathYear}` : "Chưa rõ"}
              </p>
            )}
          </div>
        </div>

        {/* Parents */}
        <div className="space-y-2">
          <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
            <GitFork className="mr-1.5 h-3.5 w-3.5" /> Cha Mẹ
          </h4>
          <div className="space-y-1.5">
            {person.father ? (
              <button
                type="button"
                onClick={() => onSelectPerson?.(person.father!.id)}
                className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium hover:border-emerald-500"
              >
                <span>Cha: {person.father.displayName}</span>
              </button>
            ) : (
              <p className="text-xs text-neutral-400 italic">Chưa có thông tin cha</p>
            )}

            {person.mother ? (
              <button
                type="button"
                onClick={() => onSelectPerson?.(person.mother!.id)}
                className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium hover:border-emerald-500"
              >
                <span>Mẹ: {person.mother.displayName}</span>
              </button>
            ) : (
              <p className="text-xs text-neutral-400 italic">Chưa có thông tin mẹ</p>
            )}
          </div>
        </div>

        {/* Spouses */}
        {person.spouses && person.spouses.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <Heart className="mr-1.5 h-3.5 w-3.5 text-rose-500" /> Hôn phối
            </h4>
            <div className="space-y-1.5">
              {person.spouses.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onSelectPerson?.(sp.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium hover:border-emerald-500"
                >
                  <span>{sp.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {person.children && person.children.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <User className="mr-1.5 h-3.5 w-3.5" /> Con cái ({person.children.length})
            </h4>
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {person.children.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onSelectPerson?.(ch.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-medium hover:border-emerald-500"
                >
                  <span>{ch.displayName}</span>
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
