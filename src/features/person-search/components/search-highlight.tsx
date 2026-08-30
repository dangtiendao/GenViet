import React from "react";
import { extractHighlightChunks } from "../utils/search-highlight";

export interface SearchHighlightProps {
  text: string;
  query?: string | null;
  className?: string;
}

/**
 * Hiển thị văn bản có highlight các đoạn khớp với từ khóa tìm kiếm
 * Sử dụng thẻ `<mark>` chuẩn HTML5, 100% an toàn (Zero dangerouslySetInnerHTML).
 */
export function SearchHighlight({ text, query, className = "" }: SearchHighlightProps) {
  const chunks = extractHighlightChunks(text, query);

  return (
    <span className={className}>
      {chunks.map((chunk, idx) =>
        chunk.isMatch ? (
          <mark key={idx} className="rounded-xs bg-amber-100 px-0.5 font-bold text-amber-900">
            {chunk.text}
          </mark>
        ) : (
          <React.Fragment key={idx}>{chunk.text}</React.Fragment>
        )
      )}
    </span>
  );
}
