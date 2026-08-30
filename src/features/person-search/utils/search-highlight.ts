import { normalizeVietnamese } from "./normalize-vietnamese";

export interface HighlightChunk {
  text: string;
  isMatch: boolean;
}

/**
 * Phân tích chuỗi họ tên thành các đoạn (chunks) có khớp hoặc không khớp với từ khóa tìm kiếm
 * Hỗ trợ so khớp tiếng Việt không dấu, không dùng `dangerouslySetInnerHTML` và bảo vệ chống XSS 100%.
 */
export function extractHighlightChunks(
  originalText: string,
  searchQuery?: string | null
): HighlightChunk[] {
  if (!originalText) return [];
  if (!searchQuery || !searchQuery.trim()) {
    return [{ text: originalText, isMatch: false }];
  }

  const queryNorm = normalizeVietnamese(searchQuery);
  if (!queryNorm) {
    return [{ text: originalText, isMatch: false }];
  }

  // Tách query thành các từ đơn để so khớp từng từ
  const queryTokens = queryNorm.split(" ").filter(Boolean);
  if (queryTokens.length === 0) {
    return [{ text: originalText, isMatch: false }];
  }

  // Tách text gốc thành các từ / token kèm khoảng trắng
  // Ví dụ: "Nguyễn Văn An" -> ["Nguyễn", " ", "Văn", " ", "An"]
  const rawParts = originalText.split(/(\s+)/);
  const chunks: HighlightChunk[] = [];

  for (const part of rawParts) {
    if (!part) continue;

    // Khoảng trắng thì không highlight
    if (/^\s+$/.test(part)) {
      chunks.push({ text: part, isMatch: false });
      continue;
    }

    const partNorm = normalizeVietnamese(part);
    const isMatched = queryTokens.some(
      (token) => partNorm.includes(token) || token.includes(partNorm)
    );

    chunks.push({
      text: part,
      isMatch: isMatched,
    });
  }

  return chunks;
}
