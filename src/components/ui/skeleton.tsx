import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "avatar" | "line" | "card";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-neutral-200/80 transition-colors motion-reduce:animate-none",
        variant === "avatar" && "h-10 w-10 rounded-full",
        variant === "line" && "h-4 w-full rounded",
        variant === "card" && "h-32 w-full rounded-lg",
        className
      )}
      {...props}
    />
  );
}
