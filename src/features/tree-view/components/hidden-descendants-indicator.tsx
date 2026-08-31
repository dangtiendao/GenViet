"use client";

import React, { useState, useRef, useEffect } from "react";
import { Users, Info } from "lucide-react";

export interface HiddenDescendantsIndicatorProps {
  personName: string;
  className?: string;
}

export function HiddenDescendantsIndicator({
  personName,
  className = "",
}: HiddenDescendantsIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Đóng tooltip khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const accessibleLabel = `Hậu duệ qua nhánh nữ của ${personName} đang được ẩn theo chế độ xem mặc định`;

  return (
    <div ref={popoverRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label={accessibleLabel}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }
        }}
        className="group/ind inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 shadow-xs transition-colors hover:border-amber-400 hover:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
        title="Nhánh có hậu duệ đang được ẩn"
      >
        <Users className="h-3 w-3 shrink-0 text-amber-600" aria-hidden="true" />
        <span className="truncate">Có hậu duệ đang ẩn</span>
        <Info className="h-2.5 w-2.5 shrink-0 text-amber-500" aria-hidden="true" />
      </button>

      {/* Popover / Tooltip giải thích chi tiết */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-1.5 w-56 -translate-x-1/2 rounded-lg border border-neutral-200 bg-white p-2.5 text-xs text-neutral-700 shadow-lg ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-1.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="leading-relaxed">
              Hậu duệ qua nhánh nữ của <strong>{personName}</strong> đang được ẩn theo chế độ hiển
              thị dòng họ mặc định.
            </p>
          </div>
          <div className="mt-2 border-t border-neutral-100 pt-1.5 text-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 focus:outline-hidden"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
