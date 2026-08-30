"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { searchPeopleAction } from "../actions/person-search.actions";
import { PersonSearchInput } from "./person-search-input";
import { PersonSearchFiltersComponent } from "./person-search-filters";
import { PersonSearchResultsComponent } from "./person-search-results";
import { ErrorState } from "@/components/feedback/error-state";
import type {
  PersonSearchResultItem,
  PersonSearchFilters,
  LivingStatusFilter,
  MissingInformationFilter,
} from "../types/person-search.types";

export interface PersonSearchClientProps {
  treeId: string;
  initialQuery?: string;
  initialBirthYear?: number | null;
  initialLivingStatus?: LivingStatusFilter;
  initialMissingInformation?: MissingInformationFilter;
}

export function PersonSearchClient({
  treeId,
  initialQuery = "",
  initialBirthYear = null,
  initialLivingStatus = "all",
  initialMissingInformation = "none",
}: PersonSearchClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<PersonSearchFilters>({
    query: initialQuery,
    birthYear: initialBirthYear,
    livingStatus: initialLivingStatus,
    missingInformation: initialMissingInformation,
  });

  const [results, setResults] = useState<PersonSearchResultItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reqSeqRef = useRef(0);

  // Cập nhật URL search params an toàn không spam history
  const updateUrlParams = useCallback(
    (newQuery: string, newFilters: PersonSearchFilters) => {
      const sp = new URLSearchParams();
      if (newQuery.trim()) sp.set("q", newQuery.trim());
      if (newFilters.birthYear) sp.set("by", String(newFilters.birthYear));
      if (newFilters.livingStatus && newFilters.livingStatus !== "all") {
        sp.set("ls", newFilters.livingStatus);
      }
      if (newFilters.missingInformation && newFilters.missingInformation !== "none") {
        sp.set("mi", newFilters.missingInformation);
      }

      const qs = sp.toString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Thực thi tìm kiếm chính
  const executeSearch = useCallback(
    async (q: string, f: PersonSearchFilters) => {
      const seq = ++reqSeqRef.current;
      setIsLoading(true);
      setErrorMsg(null);

      const res = await searchPeopleAction({
        treeId,
        query: q,
        birthYear: f.birthYear,
        livingStatus: f.livingStatus,
        missingInformation: f.missingInformation,
        cursor: null,
        limit: 20,
      });

      if (seq !== reqSeqRef.current) return;

      if (!res.success) {
        setErrorMsg(res.error.message);
        setIsLoading(false);
        return;
      }

      setResults(res.data.results);
      setNextCursor(res.data.nextCursor);
      setHasNextPage(res.data.hasNextPage);
      setIsLoading(false);
    },
    [treeId]
  );

  // Khởi động tìm kiếm lần đầu
  useEffect(() => {
    executeSearch(query, filters);
  }, [executeSearch]);

  // Xử lý thay đổi query từ ô nhập (debounced)
  const handleQueryChange = (val: string) => {
    setQuery(val);
    const newFilters = { ...filters, query: val };
    setFilters(newFilters);
    updateUrlParams(val, newFilters);
    executeSearch(val, newFilters);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (partial: Partial<PersonSearchFilters>) => {
    const newFilters = { ...filters, ...partial };
    setFilters(newFilters);
    updateUrlParams(query, newFilters);
    executeSearch(query, newFilters);
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    const defaultFilters: PersonSearchFilters = {
      query,
      birthYear: null,
      livingStatus: "all",
      missingInformation: "none",
    };
    setFilters(defaultFilters);
    updateUrlParams(query, defaultFilters);
    executeSearch(query, defaultFilters);
  };

  // Tải thêm kết quả (Cursor Pagination)
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    const res = await searchPeopleAction({
      treeId,
      query,
      birthYear: filters.birthYear,
      livingStatus: filters.livingStatus,
      missingInformation: filters.missingInformation,
      cursor: nextCursor,
      limit: 20,
    });

    if (!res.success) {
      setErrorMsg(res.error.message);
      setIsLoadingMore(false);
      return;
    }

    setResults((prev) => [...prev, ...res.data.results]);
    setNextCursor(res.data.nextCursor);
    setHasNextPage(res.data.hasNextPage);
    setIsLoadingMore(false);
  };

  return (
    <div className="space-y-5">
      {/* Vùng Ô Nhập Tìm Kiếm */}
      <PersonSearchInput
        initialValue={query}
        isLoading={isLoading}
        onSearchChange={handleQueryChange}
      />

      {/* Vùng Bộ Lọc */}
      <PersonSearchFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Vùng Báo Lỗi hoặc Kết Quả */}
      {errorMsg ? (
        <ErrorState
          title="Không thể thực thi tìm kiếm"
          message={errorMsg}
          onRetry={() => executeSearch(query, filters)}
        />
      ) : (
        <PersonSearchResultsComponent
          results={results}
          searchQuery={query}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}
