import React from "react";
import { DetailPageSkeleton } from "@/components/feedback/page-skeletons";

export default function TreeOverviewLoading() {
  return <DetailPageSkeleton breadcrumbsCount={3} type="tree" />;
}
