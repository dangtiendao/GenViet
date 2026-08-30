"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PersonSearchInputProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
}

export function PersonSearchInput({
  initialValue = "",
  placeholder = "Tìm theo họ tên (có dấu hoặc không dấu)...",
  debounceMs = 300,
  isLoading = false,
  onSearchChange,
}: PersonSearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const isComposingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const triggerSearch = useCallback(
    (val: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onSearchChange(val);
    },
    [onSearchChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isComposingRef.current) {
      timerRef.current = setTimeout(() => {
        triggerSearch(val);
      }, debounceMs);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    triggerSearch("");
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const val = (e.target as HTMLInputElement).value;
    setInputValue(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      triggerSearch(val);
    }, debounceMs);
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4" aria-hidden="true" />
        )}
      </div>

      <Input
        type="search"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        aria-label="Ô nhập từ khóa tìm kiếm nhân vật"
        className="h-11 pr-9 pl-9 text-sm shadow-2xs"
      />

      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Xóa từ khóa tìm kiếm"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
