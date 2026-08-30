"use client";

import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditHistoryItem } from "./audit-history-item";
import { AuditHistoryFilters } from "./audit-history-filters";
import { AuditEmptyState } from "./audit-empty-state";
import { getAuditHistoryAction } from "../actions/audit.actions";
import type { AuditLogDto, AuditFilterQuery, AuditHistoryResponse } from "../types/audit.types";

export interface AuditHistoryListProps {
  treeId: string;
  initialData: AuditHistoryResponse;
}

export function AuditHistoryList({ treeId, initialData }: AuditHistoryListProps) {
  const [items, setItems] = useState<AuditLogDto[]>(initialData.items);
  const [nextCursor, setNextCursor] = useState<string | null>(initialData.nextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore);
  const [filters, setFilters] = useState<AuditFilterQuery>({ limit: 20 });
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleFilterChange = (newFilters: AuditFilterQuery) => {
    setFilters(newFilters);
    startTransition(async () => {
      const res = await getAuditHistoryAction(treeId, newFilters);
      if (res.success && res.data) {
        setItems(res.data.items);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      }
    });
  };

  const handleResetFilters = () => {
    const defaultFilters: AuditFilterQuery = { limit: 20 };
    setFilters(defaultFilters);
    startTransition(async () => {
      const res = await getAuditHistoryAction(treeId, defaultFilters);
      if (res.success && res.data) {
        setItems(res.data.items);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      }
    });
  };

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await getAuditHistoryAction(treeId, {
        ...filters,
        cursor: nextCursor,
      });
      if (res.success && res.data) {
        setItems((prev) => [...prev, ...res.data!.items]);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const isFiltered = Object.keys(filters).some(
    (k) => k !== "limit" && filters[k as keyof AuditFilterQuery] !== undefined
  );

  return (
    <div className="space-y-6">
      <AuditHistoryFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {isPending ? (
        <div className="flex items-center justify-center py-12 text-neutral-400">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span className="text-xs">Đang tải nhật ký...</span>
        </div>
      ) : items.length === 0 ? (
        <AuditEmptyState isFiltered={isFiltered} />
      ) : (
        <div className="space-y-3">
          {items.map((log) => (
            <AuditHistoryItem key={log.id} log={log} />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="h-9 px-6 text-xs font-medium"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải thêm...
                  </>
                ) : (
                  "Tải thêm biến động cũ hơn"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
