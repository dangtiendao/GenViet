import React from "react";
import { Search, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { PersonSearchResultItemComponent } from "./person-search-result-item";
import type { PersonSearchResultItem } from "../types/person-search.types";

export interface PersonSearchResultsProps {
  results: PersonSearchResultItem[];
  searchQuery?: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

export function PersonSearchResultsComponent({
  results,
  searchQuery = "",
  isLoading = false,
  isLoadingMore = false,
  hasNextPage = false,
  onLoadMore,
}: PersonSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100/60 p-4"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-7 w-7 text-neutral-400" />}
        title="Không tìm thấy nhân vật phù hợp"
        description={
          searchQuery
            ? `Không có kết quả nào khớp với từ khóa "${searchQuery}". Hãy thử tìm kiếm không dấu hoặc điều chỉnh bộ lọc.`
            : "Chưa có nhân vật nào thỏa mãn điều kiện bộ lọc đã chọn."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((person) => (
          <PersonSearchResultItemComponent
            key={person.id}
            person={person}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {hasNextPage && onLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="min-h-[44px] min-w-[200px]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
                Đang tải thêm kết quả...
              </>
            ) : (
              <>
                Xem thêm kết quả
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
