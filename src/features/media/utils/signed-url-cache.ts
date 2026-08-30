import type { AvatarVariant } from "../types/media.types";

interface CacheEntry {
  url: string;
  expiresAt: number; // timestamp ms
}

class SignedUrlCacheManager {
  private cache = new Map<string, CacheEntry>();

  private buildKey(personId: string, mediaId: string, variant: AvatarVariant): string {
    return `genviet:avatar:${personId}:${mediaId}:${variant}`;
  }

  get(personId: string, mediaId: string, variant: AvatarVariant): string | null {
    const key = this.buildKey(personId, mediaId, variant);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Nếu URL sắp hết hạn trong vòng 60 giây, coi như hết hạn để làm mới
    if (Date.now() >= entry.expiresAt - 60_000) {
      this.cache.delete(key);
      return null;
    }

    return entry.url;
  }

  set(
    personId: string,
    mediaId: string,
    variant: AvatarVariant,
    url: string,
    expiresAtMs: number
  ): void {
    const key = this.buildKey(personId, mediaId, variant);
    this.cache.set(key, { url, expiresAt: expiresAtMs });
  }

  invalidate(personId: string): void {
    const prefix = `genviet:avatar:${personId}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const signedUrlCache = new SignedUrlCacheManager();
