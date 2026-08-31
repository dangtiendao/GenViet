import React from "react";
import { CardsGridPageSkeleton } from "@/components/feedback/page-skeletons";

export default function TreesTrashLoading() {
  return (
    <CardsGridPageSkeleton
      breadcrumbsCount={3}
      titleWidth="w-52"
      subtitleWidth="w-72"
      actionCount={0}
      hasSearchFilter={false}
      cardCount={4}
      cardType="trash"
    />
  );
}
