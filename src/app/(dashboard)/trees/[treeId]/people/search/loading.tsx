import React from "react";
import { SearchPageSkeleton } from "@/components/feedback/page-skeletons";

export default function PeopleSearchLoading() {
  return <SearchPageSkeleton breadcrumbsCount={4} resultCount={4} />;
}
