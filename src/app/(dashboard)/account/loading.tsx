import React from "react";
import { FormPageSkeleton } from "@/components/feedback/page-skeletons";

export default function AccountLoading() {
  return (
    <FormPageSkeleton
      breadcrumbsCount={0}
      maxWidth="max-w-2xl"
      titleWidth="w-52"
      subtitleWidth="w-80"
      fieldRows={2}
    />
  );
}
