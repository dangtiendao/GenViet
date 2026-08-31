import React from "react";
import { CardsGridPageSkeleton } from "@/components/feedback/page-skeletons";

export default function PeoplePageLoading() {
  return (
    <CardsGridPageSkeleton
      breadcrumbsCount={4}
      titleWidth="w-52"
      subtitleWidth="w-80"
      actionCount={2}
      hasSearchFilter={false}
      cardCount={6}
      cardType="person"
    />
  );
}
