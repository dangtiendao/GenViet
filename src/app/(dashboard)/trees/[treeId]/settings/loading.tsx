import React from "react";
import { FormPageSkeleton } from "@/components/feedback/page-skeletons";

export default function TreeSettingsLoading() {
  return (
    <FormPageSkeleton
      breadcrumbsCount={4}
      maxWidth="max-w-3xl"
      titleWidth="w-52"
      subtitleWidth="w-80"
      fieldRows={2}
      hasDangerZone={true}
    />
  );
}
