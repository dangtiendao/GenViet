import React from "react";
import { DetailPageSkeleton } from "@/components/feedback/page-skeletons";

export default function PersonDetailLoading() {
  return <DetailPageSkeleton breadcrumbsCount={5} type="person" />;
}
