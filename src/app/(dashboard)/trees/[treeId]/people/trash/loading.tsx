import React from "react";
import { CardsGridPageSkeleton } from "@/components/feedback/page-skeletons";

export default function PeopleTrashLoading() {
  return (
    <CardsGridPageSkeleton
      breadcrumbsCount={4}
      titleWidth="w-52"
      subtitleWidth="w-72"
      actionCount={0}
      hasSearchFilter={false}
      cardCount={4}
      cardType="trash"
    />
  );
}
