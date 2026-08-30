import * as React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  variant?: "default" | "compact";
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center",
        variant === "compact" ? "px-4 py-6" : "px-6 py-12",
        className
      )}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
        aria-hidden="true"
      >
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>

      <h3 className="text-base font-semibold text-neutral-900 md:text-lg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-600">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction &&
            (primaryAction.href ? (
              <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                onClick={primaryAction.onClick}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {primaryAction.label}
              </Button>
            ))}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
