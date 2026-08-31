import React from "react";
import { SearchPageSkeleton } from "@/components/feedback/page-skeletons";

export default function GlobalSearchLoading() {
  return <SearchPageSkeleton breadcrumbsCount={0} title="Tìm Kiếm" resultCount={3} />;
}
