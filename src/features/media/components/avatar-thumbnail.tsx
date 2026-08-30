"use client";

import React, { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import { getAvatarSignedUrlAction } from "../actions/avatar.actions";
import { signedUrlCache } from "../utils/signed-url-cache";

export interface AvatarThumbnailProps {
  treeId: string;
  personId: string;
  fullName: string;
  avatarPath?: string | null;
  gender?: "male" | "female" | "other" | "unknown";
  isDeceased?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function AvatarThumbnail({
  treeId,
  personId,
  fullName,
  avatarPath,
  gender = "unknown",
  isDeceased = false,
  size = "sm",
  className = "",
}: AvatarThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const shouldFetch = Boolean(avatarPath);

  useEffect(() => {
    if (!shouldFetch) {
      setThumbnailUrl(null);
      return;
    }

    const cachedUrl = signedUrlCache.get(personId, "active", "thumb");
    if (cachedUrl) {
      setThumbnailUrl(cachedUrl);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    getAvatarSignedUrlAction({
      treeId,
      personId,
      variant: "thumb",
      ttlSeconds: 900,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.url) {
          setThumbnailUrl(res.data.url);
          signedUrlCache.set(personId, "active", "thumb", res.data.url, res.data.expiresAt);
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

  const isMale = gender === "male";
  const isFemale = gender === "female";

  const sizeStyle = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (isLoading) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ${sizeStyle} ${className}`}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (thumbnailUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt={`Thumbnail của ${fullName}`}
        onError={() => setHasError(true)}
        className={`shrink-0 rounded-full object-cover shadow-2xs ${sizeStyle} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold shadow-2xs ${sizeStyle} ${
        isMale
          ? "bg-blue-100 text-blue-800"
          : isFemale
            ? "bg-rose-100 text-rose-800"
            : "bg-neutral-100 text-neutral-800"
      } ${isDeceased ? "opacity-75" : ""} ${className}`}
      aria-label={`Thumbnail của ${fullName}`}
    >
      {initials || <User className="h-4 w-4" />}
    </div>
  );
}
