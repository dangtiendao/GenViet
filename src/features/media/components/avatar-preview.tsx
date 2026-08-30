"use client";

import React, { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import { getAvatarSignedUrlAction } from "../actions/avatar.actions";
import { signedUrlCache } from "../utils/signed-url-cache";

export interface AvatarPreviewProps {
  treeId: string;
  personId: string;
  fullName: string;
  hasAvatar?: boolean;
  avatarPath?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export function AvatarPreview({
  treeId,
  personId,
  fullName,
  hasAvatar = false,
  avatarPath,
  size = "md",
  className = "",
}: AvatarPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const shouldFetch = hasAvatar || Boolean(avatarPath);

  useEffect(() => {
    if (!shouldFetch) {
      setImageUrl(null);
      return;
    }

    // Kiểm tra cache Signed URL trước
    const cachedUrl = signedUrlCache.get(personId, "active", "avatar");
    if (cachedUrl) {
      setImageUrl(cachedUrl);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    getAvatarSignedUrlAction({
      treeId,
      personId,
      variant: "avatar",
      ttlSeconds: 900,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.url) {
          setImageUrl(res.data.url);
          signedUrlCache.set(personId, "active", "avatar", res.data.url, res.data.expiresAt);
        } else {
          setHasError(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [treeId, personId, shouldFetch, avatarPath]);

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (isLoading) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 ${sizeClass} ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (imageUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={`Ảnh đại diện của ${fullName}`}
        onError={() => setHasError(true)}
        className={`shrink-0 rounded-2xl object-cover shadow-2xs ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800 shadow-2xs ${sizeClass} ${className}`}
      aria-label={`Ảnh đại diện chữ cái của ${fullName}`}
    >
      {initials || <User className="h-1/2 w-1/2" />}
    </div>
  );
}
