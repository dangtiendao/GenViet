import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
} = {}) {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[40px] md:min-h-[36px]";

  const variantStyles = {
    default: "bg-emerald-700 text-white shadow hover:bg-emerald-800 active:bg-emerald-900",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
    outline:
      "border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
    secondary:
      "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 active:bg-neutral-300",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
    link: "text-emerald-700 underline-offset-4 hover:underline",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm min-h-[44px] md:min-h-[40px]",
    sm: "h-9 rounded-md px-3 text-xs min-h-[40px] md:min-h-[36px]",
    lg: "h-12 rounded-md px-8 text-base min-h-[48px]",
    icon: "h-11 w-11 p-2 min-h-[44px] min-w-[44px]",
  };

  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const combinedClassName = buttonVariants({ variant, size, className });

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(combinedClassName, (children.props as { className?: string }).className),
      });
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
