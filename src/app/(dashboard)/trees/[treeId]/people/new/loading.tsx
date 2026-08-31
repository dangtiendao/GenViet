import React from "react";
import { FormPageSkeleton } from "@/components/feedback/page-skeletons";

export default function NewPersonLoading() {
  return (
    <FormPageSkeleton
      breadcrumbsCount={4}
      maxWidth="max-w-3xl"
      titleWidth="w-60"
      subtitleWidth="w-80"
      fieldRows={3}
      hasAvatar={true}
    />
  );
}
