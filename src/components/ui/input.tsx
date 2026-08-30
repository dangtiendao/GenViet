import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 min-h-[44px] w-full rounded-md border bg-white px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:min-h-[40px] md:text-sm",
          error
            ? "border-red-500 text-red-900 focus-visible:ring-red-500"
            : "border-neutral-300 text-neutral-900 focus-visible:ring-emerald-600",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
