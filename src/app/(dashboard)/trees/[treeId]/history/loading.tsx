import React from "react";
import { TimelinePageSkeleton } from "@/components/feedback/page-skeletons";

export default function TreeHistoryLoading() {
  return <TimelinePageSkeleton breadcrumbsCount={4} itemCount={4} />;
}
