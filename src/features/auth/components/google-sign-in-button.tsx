"use client";

import React, { useState } from "react";
import { startOAuthSignIn } from "../services/start-oauth-sign-in";
import { Button } from "@/components/ui/button";

export interface GoogleSignInButtonProps {
  next?: string | null;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
}

export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Google Sign-In Button Component (P29-T11, P29-T12, P29-T13)
 *
 * Adheres to:
 * - Google Identity Branding Guidelines.
 * - WCAG 2.1 AA Accessibility (accessible name, contrast, visible focus, min 44px touch target).
 * - Duplicate submission guard during connection initialization.
 */
export function GoogleSignInButton({
  next,
  onError,
  className = "",
  disabled = false,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      const result = await startOAuthSignIn({
        provider: "google",
        next: next ?? undefined,
      });

      if (!result.success) {
        setIsLoading(false);
        if (onError) {
          onError(result.message || "Không thể đăng nhập bằng Google.");
        }
      }
      // If success, Supabase client initiates the browser navigation to Google OAuth URL
    } catch (err) {
      setIsLoading(false);
      if (onError) {
        onError("Đã xảy ra lỗi không mong muốn khi kết nối Google.");
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading || disabled}
      aria-label="Tiếp tục với Google"
      className={`relative flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite">
          <svg
            className="h-4 w-4 animate-spin text-neutral-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Đang kết nối Google...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2.5">
          <GoogleIcon className="h-5 w-5 shrink-0" />
          <span>Tiếp tục với Google</span>
        </span>
      )}
    </Button>
  );
}
