export interface SearchCursorPayload {
  rankTier: number;
  similarity: number;
  normalizedName: string;
  birthYear: number | null;
  id: string;
}

/**
 * Mã hóa payload phân trang thành chuỗi cursor an toàn (Base64 URL-safe)
 */
export function encodeSearchCursor(payload: SearchCursorPayload): string {
  const jsonStr = JSON.stringify([
    payload.rankTier,
    Math.round(payload.similarity * 10000) / 10000,
    payload.normalizedName,
    payload.birthYear,
    payload.id,
  ]);

  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  return Buffer.from(jsonStr, "utf8").toString("base64url");
}

/**
 * Giải mã chuỗi cursor an toàn thành SearchCursorPayload
 */
export function decodeSearchCursor(cursor?: string | null): SearchCursorPayload | null {
  if (!cursor || typeof cursor !== "string") return null;

  try {
    let rawJson = "";
    if (typeof atob === "function") {
      let base64 = cursor.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4 !== 0) {
        base64 += "=";
      }
      rawJson = decodeURIComponent(escape(atob(base64)));
    } else {
      rawJson = Buffer.from(cursor, "base64url").toString("utf8");
    }

    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed) || parsed.length !== 5) {
      return null;
    }

    const [rankTier, similarity, normalizedName, birthYear, id] = parsed;

    if (
      typeof rankTier !== "number" ||
      typeof similarity !== "number" ||
      typeof normalizedName !== "string" ||
      (birthYear !== null && typeof birthYear !== "number") ||
      typeof id !== "string"
    ) {
      return null;
    }

    return {
      rankTier,
      similarity,
      normalizedName,
      birthYear,
      id,
    };
  } catch {
    return null;
  }
}
