import React from "react";
import { CardsGridPageSkeleton } from "@/components/feedback/page-skeletons";

export default function TreesPageLoading() {
  return (
    <CardsGridPageSkeleton
      breadcrumbsCount={2}
      titleWidth="w-48"
      subtitleWidth="w-72"
      actionCount={2}
      hasSearchFilter={true}
      cardCount={6}
      cardType="tree"
    />
  );
}
