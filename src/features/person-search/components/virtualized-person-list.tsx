"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { PersonSearchResultItemComponent } from "./person-search-result-item";
import type { PersonSearchResultItem } from "../types/person-search.types";

export interface VirtualizedPersonListProps {
  results: PersonSearchResultItem[];
  searchQuery?: string;
  itemHeight?: number; // Chiều cao ước tính mỗi dòng (px)
  overscan?: number; // Số lượng item đệm trên và dưới
  containerHeight?: number; // Chiều cao khung nhìn (px)
}

/**
 * Danh sách kết quả tìm kiếm ảo hóa (Windowed Virtualization) cho tập dữ liệu lớn (P23-T16)
 * Giới hạn số lượng DOM nodes hiển thị đồng thời mà vẫn giữ trọn vẹn khả năng tiếp cận và sự kiện bàn phím.
 */
export function VirtualizedPersonList({
  results,
  searchQuery = "",
  itemHeight = 180,
  overscan = 3,
  containerHeight = 600,
}: VirtualizedPersonListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalItems = results.length;
  const totalHeight = totalItems * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
    const end = Math.min(totalItems, start + visibleCount);
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, overscan, containerHeight, totalItems]);

  const visibleItems = useMemo(() => {
    return results.slice(startIndex, endIndex).map((item, index) => ({
      item,
      actualIndex: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [results, startIndex, endIndex, itemHeight]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflowY: "auto" }}
      className="relative w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2"
      role="region"
      aria-label="Danh sách kết quả tìm kiếm ảo hóa"
      tabIndex={0}
    >
      <div style={{ height: totalHeight, position: "relative", width: "100%" }}>
        {visibleItems.map(({ item, top }) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top,
              left: 0,
              right: 0,
              height: itemHeight - 12, // Trừ khoảng đệm giữa các items
            }}
          >
            <PersonSearchResultItemComponent person={item} searchQuery={searchQuery} />
          </div>
        ))}
      </div>
    </div>
  );
}
