import React from "react";
import { FormPageSkeleton } from "@/components/feedback/page-skeletons";

export default function ImportTreeLoading() {
  return (
    <FormPageSkeleton
      breadcrumbsCount={3}
      maxWidth="max-w-2xl"
      titleWidth="w-52"
      subtitleWidth="w-80"
      fieldRows={1}
      hasFileUpload={true}
    />
  );
}
