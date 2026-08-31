"use client";

import React from "react";
import { AUTH_ERROR_MAP, type AuthErrorCode } from "../errors";

export interface OAuthErrorMessageProps {
  code?: AuthErrorCode | string | null;
  message?: string | null;
  className?: string;
}

export function OAuthErrorMessage({ code, message, className = "" }: OAuthErrorMessageProps) {
  if (!code && !message) {
    return null;
  }

  const errorDetail = code && code in AUTH_ERROR_MAP ? AUTH_ERROR_MAP[code as AuthErrorCode] : null;

  const displayMessage =
    message || errorDetail?.messageVi || "Đã xảy ra lỗi trong quá trình xác thực.";

  return (
    <div
      role="alert"
      className={`border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-xs font-medium ${className}`}
    >
      {displayMessage}
    </div>
  );
}
