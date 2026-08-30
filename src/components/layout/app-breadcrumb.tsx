import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-neutral-500", className)}
    >
      <ol className="flex items-center space-x-1.5 overflow-hidden">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-1.5 truncate">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate font-medium",
                    isLast ? "text-neutral-900" : "text-neutral-500"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="truncate rounded px-1 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
