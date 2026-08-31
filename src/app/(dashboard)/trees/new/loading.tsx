import React from "react";
import { FormPageSkeleton } from "@/components/feedback/page-skeletons";

export default function NewTreeLoading() {
  return (
    <FormPageSkeleton
      breadcrumbsCount={3}
      maxWidth="max-w-2xl"
      titleWidth="w-48"
      subtitleWidth="w-72"
      fieldRows={2}
    />
  );
}
