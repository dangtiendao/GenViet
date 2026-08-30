"use client";

import { useState, useCallback } from "react";

export function useTreeSelection() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const selectPerson = useCallback((personId: string | null) => {
    setSelectedPersonId(personId);
    setIsDetailOpen(Boolean(personId));
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  return {
    selectedPersonId,
    isDetailOpen,
    selectPerson,
    closeDetail,
  };
}
